const express = require("express");
const app = express();
const routes = require("../src/routes");
const cookieParser = require("cookie-parser");
const swaggerDocs = require("./config/swagger");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Swagger
swaggerDocs(app);

// Routes
app.use(routes);

app.get("/", (req, res) => {
    res.send("Hello World! This is a GET request response from order-service.");
});

module.exports = app;
