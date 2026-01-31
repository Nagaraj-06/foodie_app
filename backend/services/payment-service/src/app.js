const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const swaggerDocs = require("./config/swagger");
const routes = require("./routes");

app.use(cookieParser());
// Webhook route needs raw body for signature verification
app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    require("./controller/webhook.controller").handleStripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
swaggerDocs(app);

// Routes
app.use(routes);

module.exports = app;
