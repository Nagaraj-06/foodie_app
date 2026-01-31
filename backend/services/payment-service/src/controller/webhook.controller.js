const { prisma } = require("@foodie-app/prisma-client");
const Stripe = require("stripe");
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = require("../config/env");
const { sendPaymentSuccessEvent } = require("../producers/payment.producer");

const stripe = new Stripe(STRIPE_SECRET_KEY);

/**
 * Handles Stripe Webhook events.
 */
async function handleStripeWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook Signature Verification Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        try {
            const result = await prisma.$transaction(async (tx) => {
                const payment = await tx.payments.update({
                    where: { stripe_payment_intent_id: paymentIntent.id },
                    data: {
                        status: "CAPTURED",
                        transaction_id: paymentIntent.latest_charge,
                    },
                });

                return payment;
            });

            // Emit Kafka Event
            await sendPaymentSuccessEvent(result);
        } catch (error) {
            console.error("Error processing webhook payment success:", error);
        }
    }

    res.json({ received: true });
}

module.exports = {
    handleStripeWebhook,
};
