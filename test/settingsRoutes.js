"use strict";

// set flag before requiring `app`
process.env.NODE_ENV = "test";

const app = require("../server.js");
const request = require("supertest");

describe("GET /settings/budgetCategories", function() {

  it("responds with json", function(done) {
    request(app)
      .get("/settings/budgetCategories")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done);
  });

  it("returned object is an array of objects", function(done) {
    request(app)
      .get("/settings/budgetCategories")
      .expect(function(res) {
        const body = res.body;
        if (!Array.isArray(body)) {
          throw new Error("Json response is not an array");
        }
      })
      .end(done);
  });

  it("first object in array has keys `id` and `name`", function(done) {
    request(app)
      .get("/settings/budgetCategories")
      .expect(function(res) {
        const firstObject = res.body[0]; 
        if (!firstObject.hasOwnProperty("id")) {
          throw new Error("First object in array does not have `id` key");
        }
        if (!firstObject.hasOwnProperty("name")) {
          throw new Error("First object in array does not have `name` key");
        }
      })
      .end(done);
  });
});

describe("GET /settings/paymentSources", function() {

  it("responds with json", function(done) {
    request(app)
      .get("/settings/paymentSources")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done);
  });

  it("returned object is an array of objects", function(done) {
    request(app)
      .get("/settings/paymentSources")
      .expect(function(res) {
        const body = res.body;
        if (!Array.isArray(body)) {
          throw new Error("Json response is not an array");
        }
      })
      .end(done);
  });

  it("first object in array has keys `id` and `name`", function(done) {
    request(app)
      .get("/settings/paymentSources")
      .expect(function(res) {
        const firstObject = res.body[0]; 
        if (!firstObject.hasOwnProperty("id")) {
          throw new Error("First object in array does not have `id` key");
        }
        if (!firstObject.hasOwnProperty("name")) {
          throw new Error("First object in array does not have `name` key");
        }
      })
      .end(done);
  });
});

