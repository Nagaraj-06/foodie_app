const express = require("express");
const app = express();
const rateLimiter = require("./middlewares/rateLimit.middleware");
const routes = require("../src/routes");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Apply globally
app.use(rateLimiter);

// middle wares
app.use(errorMiddleware);

module.exports = app;
