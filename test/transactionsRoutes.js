"use strict";

// set flag before requiring `app`
process.env.NODE_ENV = "test";

const app = require("../server.js");
const request = require("supertest");

let postData, transactionId;

describe("GET /transactions", function() {

  it("responds with json", function(done) {
    request(app)
      .get("/transactions")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done);
  });

  it("object has key `transactions` whose value is an array", function(done) {
    request(app)
      .get("/transactions")
      .expect(function(res) {
        const body = res.body;
        if (!body.hasOwnProperty("transactions")) {
          throw new Error("Object is missing `transactions` key");
        }
        if (!Array.isArray(body.transactions)) {
          throw new Error("Object.transactions is not an array");
        }
      })
      .end(done);
  });
});

describe("POST /transactions", function() {
  postData = {
    date: "2020-10-27",
    sourceId: 1,
    payee: "test",
    categoryId: 1,
    amount: 0.99,
    notes: "",
  };

  it("responds with a new transaction object", function(done) {
    request(app)
      .post("/transactions")
      .send(postData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .expect(function(res) {
        const body = res.body;
        if (!body.hasOwnProperty("id")) {
          throw new Error("Object does not have `id` key");
        }
        transactionId = body.id;
      })
      .end(done);
  });
});

describe("GET /transactions/{id}", function() {

  it("responds with a transaction with the same id", function(done) {
    request(app)
      .get(`/transactions/${transactionId}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        const body = res.body;
        if (body.id !== transactionId) {
          throw new Error("Object does not have matching id");
        }
      })
      .end(done);
  });
});

describe("PUT /transactions/{id}", function() {
  const putData = Object.assign({}, postData);
  putData.notes = "this value has changed";

  it("responds with a transaction with the same id", function(done) {
    request(app)
      .put(`/transactions/${transactionId}`)
      .send(putData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        const body = res.body;
        if (body.id !== transactionId) {
          throw new Error("Object does not have matching id");
        }
      })
      .end(done);
  });

  it("changes the state of the transaction", function(done) {
    request(app)
      .get(`/transactions/${transactionId}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(function(res) {
        const body = res.body;
        if (body.notes !== putData.notes) {
          throw new Error("Object does not have the updated value");
        }
      })
      .end(done);
  });
});

describe("DELETE /transactions/{id}", function() {

  it("deletes the previously created transaction", function(done) {
    request(app)
      .delete(`/transactions/${transactionId}`)
      .expect(204)
      .end(done);
  });
});


