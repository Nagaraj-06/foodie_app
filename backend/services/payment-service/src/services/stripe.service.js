const Stripe = require("stripe");
const { STRIPE_SECRET_KEY } = require("../config/env");

const stripe = new Stripe(STRIPE_SECRET_KEY);

/**
 * Creates a Stripe Checkout Session (Hosted UI).
 * @param {number} amount - Order total in INR.
 * @param {string} orderId - Business order ID.
 * @param {string} successUrl - URL to redirect on success.
 * @param {string} cancelUrl - URL to redirect on cancel.
 */
async function createStripeCheckoutSessionService(amount, orderId, successUrl, cancelUrl) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Foodie App Order",
                            description: `Order #${orderId.slice(0, 8)}`,
                        },
                        unit_amount: Math.round(amount * 100), // paisa
                    },
                    quantity: 1,
                },
            ],
            metadata: { orderId },
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
        return session;
    } catch (error) {
        console.error("Stripe Checkout Session Error:", error);
        throw new Error("Failed to create Stripe checkout session");
    }
}

/**
 * Retrieves a Stripe Checkout Session by ID.
 */
async function retrieveStripeCheckoutSessionService(sessionId) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return session;
    } catch (error) {
        console.error("Stripe Retrieve Checkout Session Error:", error);
        throw new Error("Failed to retrieve Stripe checkout session");
    }
}

module.exports = {
    createStripeCheckoutSessionService,
    retrieveStripeCheckoutSessionService,
};
