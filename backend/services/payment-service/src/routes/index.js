const express = require("express");
const router = express.Router();
const razorpayRoutes = require("./razorpay.routes");

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Utility]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/health", (req, res) => {
    res.json({ message: "Payment service is healthy" });
});

router.use("/razorpay", razorpayRoutes);

module.exports = router;
