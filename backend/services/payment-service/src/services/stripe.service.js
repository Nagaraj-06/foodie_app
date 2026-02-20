const Stripe = require("stripe");
const { STRIPE_SECRET_KEY } = require("../config/env");

const stripe = new Stripe(STRIPE_SECRET_KEY);

/**
 * Creates a Stripe Payment Intent.
 * @param {number} amount - Amount in INR (will be converted to paisa).
 * @param {string} orderId - The business order ID.
 */
async function createStripePaymentIntentService(amount, orderId) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // convert to cents/paisa
            currency: "inr",
            metadata: { orderId },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return paymentIntent;
    } catch (error) {
        console.error("Stripe Payment Intent Error:", error);
        throw new Error("Failed to create Stripe payment intent");
    }
}

/**
 * Verifies a Stripe Payment Intent.
 */
async function retrieveStripePaymentIntentService(paymentIntentId) {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        console.error("Stripe Retrieve Error:", error);
        throw new Error("Failed to retrieve Stripe payment intent");
    }
}

/**
 * Confirms a Stripe Payment Intent on the backend (useful for testing).
 */
async function confirmStripePaymentIntentService(paymentIntentId, paymentMethodId = "pm_card_visa") {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
            return_url: "https://example.com/return", // Required for some payment methods
        });
        return paymentIntent;
    } catch (error) {
        console.error("Stripe Confirm Error:", error);
        throw new Error(error.message);
    }
}

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

module.exports = {
    createStripePaymentIntentService,
    retrieveStripePaymentIntentService,
    confirmStripePaymentIntentService,
    createStripeCheckoutSessionService,
};
