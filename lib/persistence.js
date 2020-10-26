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
    const { date, sourceId, payee, categoryId, amount, notes } = params;
    
    const userId = await this._getUserId(this.username);

    const INSERT_TRANSACTION = 
      "INSERT INTO transactions (user_id, date, payment_source_id, payee, notes) " +
      "VALUES ($1, $2, $3, $4, $5) " +
      "RETURNING id";

    let res = await dbQuery(
      INSERT_TRANSACTION, userId, date, sourceId, payee, notes);
    
    if (res.rowCount === 0) return false;

    const transactionId = res.rows[0].id;
    
    const INSERT_TRANSACTION_CATEGORIES = 
      "INSERT INTO transactions_categories (transaction_id, category_id, amount) " +
      "VALUES ($1, $2, $3)";
    
    res = await dbQuery(
      INSERT_TRANSACTION_CATEGORIES, transactionId, categoryId, amount);

    return this.getTransactionById(transactionId);
  }
  
  // Deletes a transaction given the transaction id. Also deletes the 
  // associated rows in transactions_categories by cascade.
  // Returns a Promise that resolves to a boolean. True if the transaction was
  // successfully deleted. False otherwise.
  async deleteTransaction(transactionId) {
    const DELETE_TRANSACTION = 
      "DELETE FROM transactions WHERE id = $1";
    
    const res = await dbQuery(DELETE_TRANSACTION, transactionId);
    
    return res.rowCount > 0;
  }
  
  // Edits a transaction.
  // Returns a Promise that resolves to an updated transaction object.
  // TODO: Handle split transactions, i.e. multiple categories and amounts
  async editTransaction(params) {
    const { transactionId, date, sourceId, payee, categoryId, amount, notes } 
      = params;
    
    const UPDATE_TRANSACTION = 
      "UPDATE transactions " +
      "SET date = $1, payment_source_id = $2, payee = $3, notes = $4 " +
      "WHERE id = $5";

    let res = await dbQuery(UPDATE_TRANSACTION, 
      date, sourceId, payee, notes, transactionId);
    
    if (res.rowCount === 0) return false;

    const UPDATE_CATEGORIES = 
      "UPDATE transactions_categories " +
      "SET category_id = $1, amount = $2 " +
      "WHERE transaction_id = $3";
   
    res = await dbQuery(UPDATE_CATEGORIES, categoryId, amount, transactionId);
    
    if (res.rowCount === 0) return false;

    return this.getTransactionById(transactionId);
  }

  // Retrieve all transactions for a user.
  // Returns a Promise that resolves to an array of objects. Transaction 
  // objects are sorted by date ascending.
  async getAllTransactions() {
    const userId = await this._getUserId(this.username);

    const TRANSACTION_IDS_FOR_USER = 
      "SELECT id " +
      "FROM transactions " +
      "WHERE user_id = $1 " +
      "ORDER BY date";
      
    const res = await dbQuery(TRANSACTION_IDS_FOR_USER, userId);
    const transactionIds = res.rows; 

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
    const QUERY_STRING =
      "SELECT c.name AS category, tc.amount " +
      "FROM transactions_categories AS tc " +
      "INNER JOIN categories AS c ON tc.category_id = c.id " +
      "WHERE tc.transaction_id = $1";

    const res = await dbQuery(QUERY_STRING, transactionId);
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
    const TRANSACTION_BY_ID = 
      "SELECT t.id, t.date, t.payee, t.notes, p.name AS source " +
      "FROM transactions AS t " +
      "INNER JOIN payment_sources AS p ON t.payment_source_id = p.id " +
      "WHERE t.id = $1";

    const res = await dbQuery(TRANSACTION_BY_ID, transactionId);
    const transaction = res.rows[0];
    
    const amounts = await this.getCategoriesAndAmountsForTransaction(transactionId);
    transaction.categories = amounts;

    return transaction;
  }

  // Get the user id given a username.
  // Returns a Promise that resolves to a string.
  async _getUserId(username) {
    const SELECT_USER_ID = "SELECT id FROM users WHERE email = $1";

    const res = await dbQuery(SELECT_USER_ID, username);
    return res.rows[0].id;
  }
}

module.exports = Persistence;


