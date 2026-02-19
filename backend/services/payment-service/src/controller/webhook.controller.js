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
    let signatureValid = false;
    let processed = false;
    let orderId = null;
    let paymentId = null;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            STRIPE_WEBHOOK_SECRET
        );
        signatureValid = true;
    } catch (err) {
        console.error("Webhook Signature Verification Failed:", err.message);

        // Log failed signature attempt
        try {
            await prisma.webhook_logs.create({
                data: {
                    gateway: "STRIPE",
                    order_id: "UNKNOWN",
                    payment_id: "UNKNOWN",
                    event_type: "INVALID_SIGNATURE",
                    payload: typeof req.body === 'string' ? JSON.parse(req.body) : req.body,
                    signature_valid: false,
                    processed: false,
                    received_at: new Date(),
                }
            });
        } catch (logError) {
            console.error("Failed to log invalid signature webhook:", logError);
        }

        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        orderId = paymentIntent.metadata.orderId;

        try {
            const result = await prisma.$transaction(async (tx) => {
                const payment = await tx.payments.update({
                    where: { stripe_payment_intent_id: paymentIntent.id },
                    data: {
                        status: "CAPTURED",
                        transaction_id: paymentIntent.latest_charge,
                    },
                });

                paymentId = payment.id;
                return payment;
            });

            // Emit Kafka Event
            await sendPaymentSuccessEvent(result);
            processed = true;
        } catch (error) {
            console.error("Error processing webhook payment success:", error);
        }
    }

    // Log the received event
    try {
        await prisma.webhook_logs.create({
            data: {
                gateway: "STRIPE",
                order_id: orderId || "UNKNOWN",
                payment_id: paymentId || "UNKNOWN",
                event_type: event.type,
                payload: event,
                signature_valid: signatureValid,
                processed: processed,
                received_at: new Date(),
            }
        });
    } catch (logError) {
        console.error("Failed to log webhook event:", logError);
    }

    res.json({ received: true });
}

module.exports = {
    handleStripeWebhook,
};
