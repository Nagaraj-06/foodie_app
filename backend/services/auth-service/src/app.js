const express = require("express");
const app = express();
const rateLimiter = require("./middlewares/rateLimit.middleware");
const routes = require("../src/routes");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerDocs = require("./config/swagger");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Passport
require("./config/passport");
const passport = require("passport");
app.use(passport.initialize());

// Swagger

swaggerDocs(app);

// Routes
app.use(routes);

// Apply globally
app.use(rateLimiter);

// middle wares
app.use(errorMiddleware);

module.exports = app;
