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

    const text = 
      "SELECT id, name " +
      "FROM categories " +
      "WHERE user_id = $1 " +
      "ORDER BY name";
     
    const values = [ userId ];

    const res = await dbQuery(text, values);
    
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

    const text = 
      "SELECT id, name " +
      "FROM payment_sources " +
      "WHERE user_id = $1 " +
      "ORDER BY name";
     
    const values = [ userId ];

    const res = await dbQuery(text, values);
    
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
    const text = "SELECT id FROM users WHERE email = $1";
    const values = [ username ];

    const res = await dbQuery(text, values);
    return res.rows[0].id;
  }
}

module.exports = Persistence;


