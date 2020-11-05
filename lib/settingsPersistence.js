"use strict";

const { dbQuery } = require("./dbQuery");

class Persistence {
  constructor(username) {
    this.username = username;
  }
 
  // Retrieve all budget categories for a user.
  // Returns a Promise that resolves to an array of objects. 
  // Each object has keys `id` and `name`.
  // Objects are sorted by category name ascending.
  async getAllBudgetCategories() {
    const userId = await this._getUserId(this.username);

    const BUDGET_CATEGORIES_FOR_USER = 
      "SELECT id, name " +
      "FROM categories " +
      "WHERE user_id = $1 " +
      "ORDER BY name";
      
    const res = await dbQuery(BUDGET_CATEGORIES_FOR_USER, userId);
    
    // if there are no budget categories for the user, the function will
    // resolve to an empty array, rather than return a falsey value. only 
    // return a falsey value if there is an error. an empty array simply means
    // the user hasn't added any budget categories; its not an error condition
    // on the server.
    return res.rows;
  }
  
  // Retrieve all payment sources for a user.
  // Returns a Promise that resolves to an array of objects. 
  // Each object has keys `id` and `name`.
  // Objects are sorted by name ascending.
  async getAllPaymentSources() {
    const userId = await this._getUserId(this.username);

    const PAYMENT_SOURCES_FOR_USER = 
      "SELECT id, name " +
      "FROM payment_sources " +
      "WHERE user_id = $1 " +
      "ORDER BY name";
      
    const res = await dbQuery(PAYMENT_SOURCES_FOR_USER, userId);
    
    // if there are no payment sources for the user, the function will
    // resolve to an empty array, rather than return a falsey value. only 
    // return a falsey value if there is an error. an empty array simply means
    // the user hasn't added any payment sources; its not an error condition
    // on the server.
    return res.rows;
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


