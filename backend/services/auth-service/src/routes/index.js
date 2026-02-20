const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewares/rateLimit.middleware");
const { googleLogin } = require("../controller/auth");

// Health check
router.get("/health", (req, res) => {
    res.json({ message: "Auth service is healthy" });
});

// Public routes
const authRoutes = require("./public/auth");
const publicRestaurantRoutes = require("./public/restaurant");

// Private routes
const usersRoutes = require("./private/users");
const RestaurantRoutes = require("./private/restaurant");

router.use("/public/api/auth", rateLimiter, authRoutes);
router.use("/public/api/restaurant", rateLimiter, publicRestaurantRoutes);
router.use("/private/api/users", rateLimiter, usersRoutes);

router.use("/private/api/restaurant", rateLimiter, RestaurantRoutes);

router.post("/google-login", googleLogin);

module.exports = router;
