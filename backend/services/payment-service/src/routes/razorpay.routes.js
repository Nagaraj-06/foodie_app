const express = require("express");
const router = express.Router();
const {
    createPaymentOrder,
    verifyPayment,
} = require("../controller/razorpay.controller");
const validate = require("../middlewares/validate.middleware");
const { createOrderSchema, verifyPaymentSchema } = require("./schema");

/**
 * @swagger
 * /razorpay/create-order:
 *   post:
 *     summary: Create a Razorpay order
 *     tags: [Payment]
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
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Razorpay order created
 */
router.post(
    "/create-order",
    validate(createOrderSchema),
    createPaymentOrder
);

/**
 * @swagger
 * /razorpay/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment signature
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified
 */
router.post(
    "/verify-payment",
    validate(verifyPaymentSchema),
    verifyPayment
);

module.exports = router;
