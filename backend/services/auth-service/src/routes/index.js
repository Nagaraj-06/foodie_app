const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewares/rateLimit.middleware");
const { googleLogin } = require("../controller/auth");

// Public routes
const authRoutes = require("./public/auth");

// Private routes
const usersRoutes = require("./private/users");
const RestaurantRoutes = require("./private/restaurant");

router.use("/public/api/auth", rateLimiter, authRoutes);
router.use("/private/api/user", rateLimiter, usersRoutes);

router.use("/private/api/restaurant", rateLimiter, RestaurantRoutes);

router.post("/google-login", googleLogin);

module.exports = router;
