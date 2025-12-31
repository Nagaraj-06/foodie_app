const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const rateLimiter = require("../middlewares/rateLimit.middleware");
const { googleLogin } = require("../controller/auth");

// Public routes
const authRoutes = require("./public/auth");

// Private routes
const users = require("./private/users");

router.use("/public/api/auth", rateLimiter, authRoutes);
router.post("/google-login", googleLogin);

// router.use("/private/api/swaps", authMiddleware, swapRoutes);

module.exports = router;
