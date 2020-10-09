"use strict";

const Persistence = require("../lib/persistence");
const router = require("express-promise-router")();

router.use((_req, res, next) => {
  res.locals.store = new Persistence(res.locals.username);
  next();
});

// respond with all the transactions for the user
// json object: { transactions: [{}, {}, ... {}] }
router.get("/", async (req, res, _next) => {
  const store = res.locals.store;

  const transactions = await store.getAllTransactions();

  res.json(transactions);
});

module.exports = router;


