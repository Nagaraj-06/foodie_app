const { prisma } = require("@foodie-app/prisma-client");
const { consumer } = require("../config/kafka");
const { createStripeCheckoutSessionService } = require("../services/stripe.service");

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:5173";

/**
 * Listens to the `order_created` Kafka topic.
 * When an order is created, it automatically creates a Stripe Checkout Session
 * and saves an initial payment record with status CREATED.
 *
 * The frontend calls GET /payment/session?order_id=... to retrieve the
 * checkout URL that was stored by this consumer.
 */
async function startOrderConsumer() {
    await consumer.subscribe({ topic: "order_created", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let data;
            try {
                data = JSON.parse(message.value.toString());
                console.log(`📦 [payment-service] Received order_created event:`, data);
            } catch (parseErr) {
                console.error("❌ Failed to parse order_created message:", parseErr);
                return;
            }

            const { order_id, total_amount } = data;

            if (!order_id || !total_amount) {
                console.warn("⚠️  order_created event missing order_id or total_amount, skipping.");
                return;
            }

            try {
                // Check if a payment record already exists (avoid duplicates)
                const existing = await prisma.payments.findFirst({
                    where: { order_id },
                });

                if (existing) {
                    console.log(`ℹ️  Payment record already exists for order ${order_id}, skipping.`);
                    return;
                }

                // Create Stripe Checkout Session
                const successUrl = `${FRONTEND_BASE_URL}/payment/success?order_id=${order_id}`;
                const cancelUrl = `${FRONTEND_BASE_URL}/carts`;

                const session = await createStripeCheckoutSessionService(
                    total_amount,
                    order_id,
                    successUrl,
                    cancelUrl
                );

                // Save payment record with the checkout URL for the frontend to fetch
                await prisma.payments.create({
                    data: {
                        order_id,
                        gateway: "STRIPE",
                        stripe_payment_intent_id: session.payment_intent || session.id,
                        amount: total_amount,
                        currency: "INR",
                        status: "CREATED",
                        // Store checkout URL in transaction_id as a temporary bridge
                        // until the webhook confirms the real charge ID
                        transaction_id: session.url,
                    },
                });

                console.log(`✅ Created Stripe Checkout Session for order ${order_id}: ${session.url}`);
            } catch (err) {
                console.error(`❌ Error processing order_created for ${order_id}:`, err.message);
            }
        },
    });

    console.log("🎧 Payment Service: Listening to [order_created] topic");
}

module.exports = { startOrderConsumer };
