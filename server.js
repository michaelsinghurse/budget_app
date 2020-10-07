"use strict";

const express = require("express");
const morgan = require("morgan");

const app = express();

const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.static("client"));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


