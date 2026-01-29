const Razorpay = require("razorpay");
const crypto = require("crypto");
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require("../config/env");

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

/**
 * Creates a Razorpay order.
 * @param {number} amount - Amount in INR (will be converted to paisa).
 * @param {string} receipt - Unique receipt ID (e.g., order ID).
 */
async function createRazorpayOrderService(amount, receipt) {
    const options = {
        amount: Math.round(amount * 100), // convert to paisa
        currency: "INR",
        receipt: receipt,
    };

    try {
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        throw new Error("Failed to create Razorpay order");
    }
}

/**
 * Verifies the Razorpay payment signature.
 */
function verifyRazorpaySignature(orderId, paymentId, signature) {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    return expectedSignature === signature;
}

module.exports = {
    createRazorpayOrderService,
    verifyRazorpaySignature,
};
