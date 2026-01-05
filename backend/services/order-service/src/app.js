const express = require("express");
const app = express();
const routes = require("../src/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

module.exports = app;
