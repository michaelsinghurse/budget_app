"use strict";

const { dbQuery } = require("./dbQuery");

class Persistence {
  constructor(username) {
    this.username = username;
  }
  
  async addTransaction(params) {
    const { date, source_id, payee, category_id, amount, notes } = params;
    
    const userId = await this._getUserId(this.username);

    const INSERT_TRANSACTION = 
      "INSERT INTO transactions (user_id, date, payment_source_id, payee, notes) " +
      "VALUES ($1, $2, $3, $4, $5) " +
      "RETURNING id";
    
    const INSERT_TRANSACTION_CATEGORIES = 
      "INSERT INTO transactions_categories (transaction_id, category_id, amount) " +
      "VALUES ($1, $2, $3)";
    
    const results = await dbQuery(
      INSERT_TRANSACTION, userId, date, source_id, payee, notes);
    
    const transactionId = results.rows[0].id;

    // TODO: use transactionId to now  update the transactions_categories table
    // with the values of category_id and amount
  }

  // returns an array of all transactions for the user. the transactions are
  // sorted by transaction date ascending. each transaction is an object with 
  // the following keys:
  // - id: transaction id. (number)
  // - date: transaction date. (string)
  // - payee: entity that received the payment. (string)
  // - notes: notes about the transaction (string)
  // - source: payment source (Checking, Savings, etc). (string)
  // - categories: a list of categories and amounts for the transaction. most 
  //    transactions have only one category, but split transactions will have 
  //    multiple. the list is an array of objects. each object has keys
  //    category and amount.
  async getAllTransactions() {
    const userId = await this._getUserId(this.username);

    const TRANSACTIONS_FOR_USER = 
      "SELECT t.id, t.date, t.payee, t.notes, p.name AS source " +
      "FROM transactions AS t " +
      "INNER JOIN payment_sources AS p ON t.payment_source_id = p.id " +
      "WHERE t.user_id = $1 " +
      "ORDER BY t.date";
      
    const results = await dbQuery(TRANSACTIONS_FOR_USER, userId);
    const transactions = results.rows; 
    
    for (let index = 0; index < transactions.length; index += 1) {
      const transaction_id = transactions[index].id;
      
      const amounts = await this.getCategoriesAndAmountsForTransaction(transaction_id);
      transactions[index]["categories"] = amounts;
    }

    return transactions;
  }

  // returns an array of categories and amounts for a transaction id. each
  // object has the following keys:
  // - category - the transaction category (string)
  // - amount - the amount associated with the category (number)
  async getCategoriesAndAmountsForTransaction(id) {
    const QUERY_STRING =
      "SELECT c.name AS category, tc.amount " +
      "FROM transactions_categories AS tc " +
      "INNER JOIN categories AS c ON tc.category_id = c.id " +
      "WHERE tc.transaction_id = $1";

    const results = await dbQuery(QUERY_STRING, id);
    return results.rows;
  }

  async _getUserId(username) {
    const SELECT_USER_ID = "SELECT id FROM users WHERE email = $1";

    const results = await dbQuery(SELECT_USER_ID, username);
    return results.rows[0].id;
  }
}

module.exports = Persistence;


