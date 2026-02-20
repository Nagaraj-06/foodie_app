const express = require("express");
const router = express.Router();
const {
    createPaymentIntent,
    confirmPayment,
    createCheckoutSession,
    getCheckoutSession,
} = require("../controller/stripe.controller");
const validate = require("../middlewares/validate.middleware");
const { createIntentSchema, confirmPaymentSchema, createCheckoutSessionSchema } = require("./schema");

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

/**
 * @swagger
 * /stripe/create-checkout-session:
 *   post:
 *     summary: Create a Stripe Hosted Checkout Session
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - success_url
 *               - cancel_url
 *             properties:
 *               order_id:
 *                 type: string
 *               success_url:
 *                 type: string
 *               cancel_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Checkout session created, returns checkout_url
 */
router.post(
    "/create-checkout-session",
    validate(createCheckoutSessionSchema),
    createCheckoutSession
);

/**
 * @swagger
 * /stripe/session/{order_id}:
 *   get:
 *     summary: Get pre-created Stripe Checkout Session URL for an order
 *     tags: [Stripe]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns checkout_url
 */
router.get("/session/:order_id", getCheckoutSession);

module.exports = router;
