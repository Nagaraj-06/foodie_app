const express = require("express");
const router = express.Router();
const {
    createPaymentIntent,
    confirmPayment,
} = require("../controller/stripe.controller");
const validate = require("../middlewares/validate.middleware");
const { createIntentSchema, confirmPaymentSchema } = require("./schema");

/**
 * @swagger
 * /stripe/create-intent:
 *   post:
 *     summary: Create a Stripe Payment Intent
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *             properties:
 *               order_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Intent created
 */
router.post(
    "/create-intent",
    validate(createIntentSchema),
    createPaymentIntent
);

/**
 * @swagger
 * /stripe/confirm-payment:
 *   post:
 *     summary: Confirm Stripe payment
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_intent_id
 *             properties:
 *               payment_intent_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed
 */
router.post(
    "/confirm-payment",
    validate(confirmPaymentSchema),
    confirmPayment
);

module.exports = router;
