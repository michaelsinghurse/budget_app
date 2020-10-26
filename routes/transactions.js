"use strict";

const Persistence = require("../lib/persistence");
const router = require("express-promise-router")();

router.use((_req, res, next) => {
  res.locals.store = new Persistence(res.locals.username);
  next();
});

// HTTP GET /transactions
// Respond with 200 (OK) on success
// Include all transactions for user in response body
router.get("/", async (req, res, next) => {
  const store = res.locals.store;
  const transactions = await store.getAllTransactions();
  if (transactions) {
    res.status(200).json({ transactions });
  } else {
    next(new Error("Unable to get all transactions!"));
  }
});

// HTTP GET /transactions/{id}
// Respond with 200 (OK) on success
// Include the transaction in the response body
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const store = res.locals.store;
  const transaction = await store.getTransactionById(id);
  if (transaction) {
    res.status(200).json(transaction);
  } else {
    next(new Error("Unable to get transaction with id = " + id));
  }
});

// HTTP POST /transactions
// Create a new transaction
// Responded with 201 (Created) on success
// Include location header that points to /transactions/{id}
// Include new transaction in response body
// TODO: validate and sanitize form input
router.post("/", async (req, res, next) => {
  const store = res.locals.store;
  const transaction = await store.addTransaction(req.body);
  if (transaction) {
    res.status(201).json(transaction);
  } else {
    next(new Error("Unable to create transaction!"));
  }
});

// HTTP PUT /transactions/{id}
// Edit a transaction
// Respond with 200 (OK) on success
// Include edited transaction in response body
// TODO: validate and sanitize form input
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  req.body.transactionId = id;
  const store = res.locals.store;
  const transaction = await store.editTransaction(req.body);
  if (transaction) {
    res.status(200).json(transaction);
  } else {
    next(new Error("Unable to edit transaction!"));
  }
});

// HTTP DELETE /transactions/{id}
// Deletes a transaction
// Respond with 204 (No Content) on success
// Respond with 404 (Not Found) otherwise
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const store = res.locals.store; 
  const success = store.deleteTransaction(id);
  if (success) {
    res.status(204).end();
  } else {
    next(new Error("Unable to delete transaction!"));
  }
});

module.exports = router;


