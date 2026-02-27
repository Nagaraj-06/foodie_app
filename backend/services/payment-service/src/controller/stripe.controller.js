const { prisma } = require("@foodie-app/prisma-client");
const {
    createStripeCheckoutSessionService,
    retrieveStripeCheckoutSessionService,
} = require("../services/stripe.service");
const { sendPaymentSuccessEvent } = require("../producers/payment.producer");

/**
 * On-demand: Creates a Stripe Checkout Session for the given order_id.
 * If a payment record already exists (e.g. user retrying), reuses or creates a fresh session.
 */
async function getCheckoutSession(req, res) {
    try {
        const { order_id } = req.params;

        const order = await prisma.orders.findUnique({ where: { id: order_id } });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check if order is already paid
        if (order.payment_status === "SUCCESS") {
            return res.status(400).json({ success: false, message: "Order is already paid" });
        }

        const baseUrl = process.env.FRONTEND_URL;
        const session = await createStripeCheckoutSessionService(
            order.total_amount,
            order.id,
            `${baseUrl}/payment/success?order_id=${order.id}`,
            `${baseUrl}/carts`
        );

        // Check if payment record exists (user retrying payment)
        const existingPayment = await prisma.payments.findFirst({
            where: { order_id },
            orderBy: { created_at: "desc" },
        });

        if (existingPayment) {
            // Update existing record with new session info
            await prisma.payments.update({
                where: { id: existingPayment.id },
                data: {
                    stripe_payment_intent_id: session.payment_intent || session.id,
                    transaction_id: session.url,
                    status: "CREATED",
                },
            });
        } else {
            // Create new payment record
            await prisma.payments.create({
                data: {
                    order_id: order.id,
                    gateway: "STRIPE",
                    stripe_payment_intent_id: session.payment_intent || session.id,
                    amount: order.total_amount,
                    currency: "INR",
                    status: "CREATED",
                    transaction_id: session.url,
                },
            });
        }

        return res.status(201).json({
            success: true,
            data: { checkout_url: session.url },
        });
    } catch (error) {
        console.error("Get Checkout Session Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Verifies a Stripe Checkout payment by order_id.
 * Called from the PaymentSuccess page after Stripe redirects.
 * Updates both payments and orders tables.
 */
async function verifyCheckoutPayment(req, res) {
    try {
        const { order_id } = req.params;

        // Find the payment record for this order
        const payment = await prisma.payments.findFirst({
            where: { order_id },
            orderBy: { created_at: "desc" },
        });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }

        // Already verified
        if (payment.status === "CAPTURED") {
            return res.status(200).json({ success: true, message: "Payment already verified" });
        }

        // Get checkout session ID from transaction_id (stored URL)
        let sessionId = payment.transaction_id;

        // Extract session ID from URL if needed
        if (sessionId && sessionId.includes("cs_")) {
            const match = sessionId.match(/(cs_[a-zA-Z0-9_]+)/);
            if (match) sessionId = match[1];
        }

        if (!sessionId) {
            return res.status(400).json({ success: false, message: "No checkout session found for this order" });
        }

        // Retrieve the checkout session from Stripe
        const session = await retrieveStripeCheckoutSessionService(sessionId);

        if (session.payment_status === "paid") {
            const result = await prisma.$transaction(async (tx) => {
                const updated = await tx.payments.update({
                    where: { id: payment.id },
                    data: {
                        status: "CAPTURED",
                        stripe_payment_intent_id: session.payment_intent,
                        transaction_id: session.id,
                    },
                });
                await tx.orders.update({
                    where: { id: order_id },
                    data: { payment_status: "SUCCESS", order_status: "CONFIRMED" },
                });
                return updated;
            });

            await sendPaymentSuccessEvent(result);

            return res.status(200).json({
                success: true,
                message: "Payment verified and order confirmed",
            });
        }

        res.status(400).json({
            success: false,
            message: `Checkout session payment status: ${session.payment_status}`,
        });
    } catch (error) {
        console.error("Verify Checkout Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getCheckoutSession,
    verifyCheckoutPayment,
};
