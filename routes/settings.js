"use strict";

const { body, validationResult } = require("express-validator");
const Persistence = require("../lib/settingsPersistence");
const router = require("express-promise-router")();

router.use((_req, res, next) => {
  res.locals.store = new Persistence(res.locals.username);
  next();
});

// HTTP GET /settings/budgetCategories
// Respond with 200 (OK) on success
// Include all budget categories for user in response body
// Each object has keys `id` and `name`
router.get("/budgetCategories", async (req, res, next) => {
  const store = res.locals.store;
  const budgetCategories = await store.getAllBudgetCategories();
  if (budgetCategories) {
    res.status(200).json(budgetCategories);
  } else {
    next(new Error("Unable to get all budget categories!"));
  }
});


// HTTP GET /settings/paymentSources
// Respond with 200 (OK) on success
// Include all payment sources for user in response body
// Each object has keys `id` and `name`
router.get("/paymentSources", async (req, res, next) => {
  const store = res.locals.store;
  const paymentSources = await store.getAllPaymentSources();
  if (paymentSources) {
    res.status(200).json(paymentSources);
  } else {
    next(new Error("Unable to get all payment sources!"));
  }
});

module.exports = router;


