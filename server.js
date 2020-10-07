"use strict";

const config = require("./lib/config");
const express = require("express");
const morgan = require("morgan");

const app = express();

const port = config.PORT || 3000;

app.use(morgan("dev"));
app.use(express.static("client"));

// extract session info
// TODO: install sessions
app.use((req, res, next) => {
  // res.locals.username = req.session.username;
  // res.locals.signedIn = req.session.signedIn;
  res.locals.username = config.DEV_SESSION_USERNAME;
  res.locals.signedIn = true;
  next();
});

const authenticate = (req, res, next) => {
  if (!res.locals.signedIn) {
    // res.redirect("/signin"); 
  }
  next();
};

// error handler
app.use((err, req, res, _next) => {
  console.log(error);
  res.status(500).send("Error on the server!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


