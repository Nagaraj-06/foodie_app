const express = require("express");
const app = express();
const routes = require("../src/routes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use(routes);

// app.get("/", (req, res) => {
//   res.send("Hello World! This is a GET request response from order-service.");
// });

module.exports = app;
