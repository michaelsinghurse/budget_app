"use strict";

const Persistence = require("../lib/persistence");
const router = require("express-promise-router")();

router.use((_req, res, next) => {
  res.locals.store = new Persistence(res.locals.username);
  next();
});

// HTTP GET /transactions
// respond with all the transactions for the user
// json object: { transactions: [{}, {}, ... {}] }
router.get("/", async (req, res, _next) => {
  const store = res.locals.store;

  const transactions = await store.getAllTransactions();

  res.json({ transactions });
});

// HTTP POST /transactions
// Create a new transaction
// TODO: validate and sanitize form input
router.post("/", async (req, res, next) => {
  const store = res.locals.store;
  const success = await store.addTransaction(req.body);
  if (!success) {
    next(new Error("Unable to create transaction!"));
  }
  res.redirect(303, "/");
});

// HTTP DELETE /transactions/{id}
// Respond with 204 (No Content) on success
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const store = res.locals.store; 
  const success = store.deleteTransaction(id);
  if (!success) {
    next(new Error("Unable to delete transaction!"));
  }
  res.redirect(204, "/");
});

module.exports = router;


