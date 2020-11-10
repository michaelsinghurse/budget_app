"use strict";

const config = require("./config");
const { Client } = require("pg");

const logQuery = (statement, params) => {
  if (process.env.NODE_ENV === "test") return;

  const timeStamp = new Date();
  const formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, params);
};

const isProduction = config.NODE_ENV === "production";

const CONNECTION = {
  connectionString: config.DATABASE_CONN_STRING,
  ssl: isProduction,
};

module.exports = {
  async dbQuery(statement, params) {
    const client = new Client(CONNECTION);
    
    await client.connect();
    logQuery(statement, params);
    const result = await client.query(statement, params);
    await client.end();

    return result;
  }
};


