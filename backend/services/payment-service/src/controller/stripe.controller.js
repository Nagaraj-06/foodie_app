const { prisma } = require("@foodie-app/prisma-client");
const {
    createStripePaymentIntentService,
    retrieveStripePaymentIntentService,
    confirmStripePaymentIntentService,
} = require("../services/stripe.service");
const { sendPaymentSuccessEvent } = require("../producers/payment.producer");

/**
 * Creates a Payment Intent for an order.
 */
async function createPaymentIntent(req, res) {
    try {
        const { order_id } = req.body;

        const order = await prisma.orders.findUnique({
            where: { id: order_id },
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const intent = await createStripePaymentIntentService(
            order.total_amount,
            order.id
        );

        // Save initial payment record
        await prisma.payments.create({
            data: {
                order_id: order.id,
                gateway: "STRIPE",
                stripe_payment_intent_id: intent.id,
                amount: order.total_amount,
                currency: "INR",
                status: "CREATED",
            },
        });

        res.status(201).json({
            success: true,
            data: {
                client_secret: intent.client_secret,
                payment_intent_id: intent.id,
            },
        });
    } catch (error) {
        console.error("Create Intent Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Confirms payment from frontend and updates DB.
 */
async function confirmPayment(req, res) {
    try {
        const { payment_intent_id } = req.body;

        let intent = await retrieveStripePaymentIntentService(payment_intent_id);

        // If intent needs a payment method, we can confirm it on the backend for testing
        if (intent.status === "requires_payment_method") {
            intent = await confirmStripePaymentIntentService(payment_intent_id);
        }

        if (intent.status !== "succeeded") {
            return res.status(400).json({
                success: false,
                message: `Payment status: ${intent.status}`,
                details: "Payment requires manual confirmation or frontend interaction",
            });
        }

        const result = await prisma.$transaction(async (tx) => {
            const payment = await tx.payments.update({
                where: { stripe_payment_intent_id: payment_intent_id },
                data: { status: "CAPTURED", transaction_id: intent.latest_charge },
            });

            await tx.orders.update({
                where: { id: payment.order_id },
                data: {
                    payment_status: "SUCCESS",
                    order_status: "CONFIRMED",
                },
            });

            return payment;
        });

        // 3. Emit Kafka Event
        await sendPaymentSuccessEvent(result);

        res.status(200).json({
            success: true,
            message: "Payment confirmed and order placed",
        });
    } catch (error) {
        console.error("Confirm Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    createPaymentIntent,
    confirmPayment,
};
