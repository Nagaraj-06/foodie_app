const express = require("express");
const router = express.Router();
const {
    getCheckoutSession,
    verifyCheckoutPayment,
} = require("../controller/stripe.controller");

/**
 * @swagger
 * /stripe/session/{order_id}:
 *   get:
 *     summary: Get or create a Stripe Checkout Session URL for an order
 *     tags: [Stripe]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns checkout_url (pre-created by Kafka or created on-demand)
 */
router.get("/session/:order_id", getCheckoutSession);

/**
 * @swagger
 * /stripe/verify-checkout/{order_id}:
 *   post:
 *     summary: Verify a Stripe Checkout payment and update order status
 *     tags: [Stripe]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment verified and order updated
 */
router.post("/verify-checkout/:order_id", verifyCheckoutPayment);

module.exports = router;
