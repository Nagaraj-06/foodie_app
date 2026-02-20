const express = require("express");
const app = express();
const path = require("path");
app.set('trust proxy', 1);
const rateLimiter = require("./middlewares/rateLimit.middleware");
const routes = require("../src/routes");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerDocs = require("./config/swagger");

/*
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
*/

app.use(cookieParser());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Passport
require("./config/passport");
const passport = require("passport");
app.use(passport.initialize());

// Swagger

swaggerDocs(app);

// Apply globally
app.use(rateLimiter);

// Routes
app.use(routes);

// middle wares
app.use(errorMiddleware);

module.exports = app;
