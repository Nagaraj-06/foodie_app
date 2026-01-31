const express = require("express");
const router = express.Router();
const stripeRoutes = require("./stripe.routes");

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

router.use("/stripe", stripeRoutes);

module.exports = router;
