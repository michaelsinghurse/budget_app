"use strict";

const { dbQuery } = require("./dbQuery");

class Persistence {
  constructor(username) {
    this.username = username;
  }
 
  // Adds a transaction to the transactions table and its corresponding
  // categories and amounts to the transactions_categories table.
  // Returns a Promise that resolves to a transaction object.
  // TODO: Handle split transactions, i.e. multiple categories and amounts
  async addTransaction(params) {
    const { date, sourceId, payee, categories, notes } = params;
    
    const userId = await this._getUserId(this.username);

    // step #1: insert the transaction details into the transaction table.
    // capture new transaction id so that it can be used when inserting the
    // categories and amounts associated with the transaction in step #2.
    let text = 
      "INSERT INTO transactions (user_id, date, payment_source_id, payee, notes) " +
      "VALUES ($1, $2, $3, $4, $5) " +
      "RETURNING id";
    
    let values = [ userId, date, sourceId, payee, notes ];

    let res = await dbQuery(text, values);
    
    if (res.rowCount === 0) return false;

    const transactionId = res.rows[0].id;
    
    // step #2: insert the transaction categories and amounts. iterate through
    // each object in the `categories` array in order to build the query string
    // and the parameters array.
    text = "INSERT INTO transactions_categories (transaction_id, category_id, amount) ";

    values = [];
    let value = 0;

    categories.forEach(category => {
      if (value === 0) {
        text += `VALUES ($${++value}, $${++value}, $${++value})`; 
      } else {
        text += `, ($${++value}, $${++value}, $${++value})`;
      }
      values.push(transactionId, category.categoryId, category.amount);
    });

    res = await dbQuery(text, values);

    return this.getTransactionById(transactionId);
  }
  
  // Deletes a transaction given the transaction id. Also deletes the 
  // associated rows in transactions_categories by cascade.
  // Returns a Promise that resolves to a boolean. True if the transaction was
  // successfully deleted. False otherwise.
  async deleteTransaction(transactionId) {
    const text = "DELETE FROM transactions WHERE id = $1";
    
    const values = [ transactionId ];

    const res = await dbQuery(text, values);
    
    return res.rowCount > 0;
  }
  
  // Edits a transaction.
  // Returns a Promise that resolves to an updated transaction object.
  // TODO: Handle split transactions, i.e. multiple categories and amounts
  async editTransaction(params) {
    const { transactionId, date, sourceId, payee, categories, notes } = params;
    
    // step #1: update the transactions table with the new data
    let text = 
      "UPDATE transactions " +
      "SET date = $1, payment_source_id = $2, payee = $3, notes = $4 " +
      "WHERE id = $5";
    
    let values = [ date, sourceId, payee, notes, transactionId ];
    let res = await dbQuery(text, values);
    if (res.rowCount === 0) return false;

    // step #2: remove the old categories and amounts associated with the
    // transaction from the transaction_categories table. 
    // we delete-all-then-insert rather than update-some-then-insert because 
    // we don't know how the new/edited fields map to the rows in the table.
    text = "DELETE FROM transactions_categories WHERE transaction_id = $1";
    values = [ transactionId ];
    res = await dbQuery(text, values);

    // step #3: insert the new categories and amounts
    // TODO: DRY with the addTransactions() method
    text = "INSERT INTO transactions_categories (transaction_id, category_id, amount) ";

    values = [];
    let value = 0;

    categories.forEach(category => {
      if (value === 0) {
        text += `VALUES ($${++value}, $${++value}, $${++value})`; 
      } else {
        text += `, ($${++value}, $${++value}, $${++value})`;
      }
      values.push(transactionId, category.categoryId, category.amount);
    });

    res = await dbQuery(text, values);

    return this.getTransactionById(transactionId);
  }

  // Retrieve all transactions for a user.
  // Returns a Promise that resolves to an array of objects. Transaction 
  // objects are sorted by date ascending.
  async getAllTransactions() {
    const userId = await this._getUserId(this.username);

    // step #1: get all the transaction ids from the transactions table
    // TODO: there is an extra (unnecessary?) database read with this method.
    // the alternative is to retrieve all transactions (rather
    // than just retrieving the id's only) and then iterate through each 
    // transaction and add the categories and amounts to it. 
    const text = 
      "SELECT id " +
      "FROM transactions " +
      "WHERE user_id = $1 " +
      "ORDER BY date";
    
    const values = [ userId ];

    const res = await dbQuery(text, values);
    const transactionIds = res.rows; 

    // step #2: iterate through the transaction ids and get the transaction for
    // each id. add it to the `transactions` array.
    const transactions = [];
    for (let index = 0; index < transactionIds.length; index += 1) {
      const transactionId = transactionIds[index].id;
      const transaction = await this.getTransactionById(transactionId);
      transactions.push(transaction);
    }

    return transactions;
  }

  // Retrieve the categories and amounts associated with a transaction id.  
  // Returns a Promise that resolves to an array of objects. Each object 
  // has the following keys:
  // - category - the budget category (string)
  // - amount - the amount associated with the category (number)
  async getCategoriesAndAmountsForTransaction(transactionId) {
    const text =
      "SELECT c.name AS category, tc.amount " +
      "FROM transactions_categories AS tc " +
      "INNER JOIN categories AS c ON tc.category_id = c.id " +
      "WHERE tc.transaction_id = $1";
    
    const values = [ transactionId ];

    const res = await dbQuery(text, values);
    return res.rows;
  }
  
  // Retrieve the transaction associated with the transaction id.
  // Returns a Promise that resolves to a transaction object.
  // Each object has the following keys:
  // - id: transaction id. (number)
  // - date: transaction date. (string)
  // - payee: entity that received the payment. (string)
  // - notes: notes about the transaction (string)
  // - source: payment source (Checking, Savings, etc). (string)
  // - categories: an array of categories and amounts for the transaction. most 
  //    transactions have only one category, but split transactions will have 
  //    multiple. each category is an object with keys category (string) and 
  //    amount (number)
  async getTransactionById(transactionId) {
    const text = 
      "SELECT t.id, t.date, t.payee, t.notes, p.name AS source " +
      "FROM transactions AS t " +
      "INNER JOIN payment_sources AS p ON t.payment_source_id = p.id " +
      "WHERE t.id = $1";
    
    const values = [ transactionId ];

    const res = await dbQuery(text, values);

    if (res.rowCount === 0) return false;

    const transaction = res.rows[0];
    
    const amounts = await this.getCategoriesAndAmountsForTransaction(transactionId);
    transaction.categories = amounts;

    return transaction;
  }

  // Get the user id given a username.
  // Returns a Promise that resolves to a string.
  async _getUserId(username) {
    const text = "SELECT id FROM users WHERE email = $1";

    const values = [ username ];

    const res = await dbQuery(text, values);
    return res.rows[0].id;
  }
}

module.exports = Persistence;


