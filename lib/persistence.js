"use strict";

const { dbQuery } = require("./dbQuery");

class Persistence {
  constructor(username) {
    this.username = username;
  }
  
  // Returns a Promise that resolves to a boolean. True if the transaction was
  // successfully added. False if not.
  async addTransaction(params) {
    const { date, source_id, payee, category_id, amount, notes } = params;
    
    const userId = await this._getUserId(this.username);

    const INSERT_TRANSACTION = 
      "INSERT INTO transactions (user_id, date, payment_source_id, payee, notes) " +
      "VALUES ($1, $2, $3, $4, $5) " +
      "RETURNING id";

    let res = await dbQuery(
      INSERT_TRANSACTION, userId, date, source_id, payee, notes);
    
    if (res.rowCount === 0) return false;

    const transactionId = res.rows[0].id;
    
    const INSERT_TRANSACTION_CATEGORIES = 
      "INSERT INTO transactions_categories (transaction_id, category_id, amount) " +
      "VALUES ($1, $2, $3)";
    
    res = await dbQuery(
      INSERT_TRANSACTION_CATEGORIES, transactionId, category_id, amount);

    return res.rowCount > 0;
  }

  // Returns a Promise that resolves to an array of all transactions for the 
  // user. Transaction objects are sorted by date ascending. Each transaction 
  // has the following keys:
  // - id: transaction id. (number)
  // - date: transaction date. (string)
  // - payee: entity that received the payment. (string)
  // - notes: notes about the transaction (string)
  // - source: payment source (Checking, Savings, etc). (string)
  // - categories: an array of categories and amounts for the transaction. most 
  //    transactions have only one category, but split transactions will have 
  //    multiple. each category is an object with keys category (string) and 
  //    amount (number)
  async getAllTransactions() {
    const userId = await this._getUserId(this.username);

    const TRANSACTIONS_FOR_USER = 
      "SELECT t.id, t.date, t.payee, t.notes, p.name AS source " +
      "FROM transactions AS t " +
      "INNER JOIN payment_sources AS p ON t.payment_source_id = p.id " +
      "WHERE t.user_id = $1 " +
      "ORDER BY t.date";
      
    const res = await dbQuery(TRANSACTIONS_FOR_USER, userId);
    const transactions = res.rows; 
    
    for (let index = 0; index < transactions.length; index += 1) {
      const transactionId = transactions[index].id;
      
      const amounts = await this.getCategoriesAndAmountsForTransaction(transactionId);
      transactions[index]["categories"] = amounts;
    }

    return transactions;
  }

  // Returns a Promise that resolves to an array of objects. Each object 
  // has represents a category-amount pair. The object has the following keys:
  // - category - the budget category (string)
  // - amount - the amount associated with the category (number)
  async getCategoriesAndAmountsForTransaction(id) {
    const QUERY_STRING =
      "SELECT c.name AS category, tc.amount " +
      "FROM transactions_categories AS tc " +
      "INNER JOIN categories AS c ON tc.category_id = c.id " +
      "WHERE tc.transaction_id = $1";

    const res = await dbQuery(QUERY_STRING, id);
    return res.rows;
  }

  // Returns a Promise that resolves to a string. The string is the user id
  // associated with the username.
  async _getUserId(username) {
    const SELECT_USER_ID = "SELECT id FROM users WHERE email = $1";

    const res = await dbQuery(SELECT_USER_ID, username);
    return res.rows[0].id;
  }
}

module.exports = Persistence;


