const { prisma } = require("@foodie-app/prisma-client");
const {
    createRazorpayOrderService,
    verifyRazorpaySignature,
} = require("../services/razorpay.service");

/**
 * Initiates a payment for an existing order.
 */
async function createPaymentOrder(req, res) {
    try {
        const { order_id } = req.body;

        // 1. Fetch order details from DB
        const order = await prisma.orders.findUnique({
            where: { id: order_id },
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // 2. Create Razorpay Order
        const razorpayOrder = await createRazorpayOrderService(
            order.total_amount,
            order.id
        );

        // 3. Create initial payment record
        await prisma.payments.create({
            data: {
                order_id: order.id,
                gateway: "RAZORPAY",
                razorpay_order_id: razorpayOrder.id,
                amount: order.total_amount,
                currency: "INR",
                status: "CREATED",
            },
        });

        res.status(201).json({
            success: true,
            data: {
                razorpay_order_id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },
        });
    } catch (error) {
        console.error("Create Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * Verifies the payment signature and updates order status.
 */
async function verifyPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // 1. Verify Signature
        const isValid = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            // Update payment record as FAILED
            await prisma.payments.update({
                where: { razorpay_order_id },
                data: { status: "FAILED" },
            });

            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // 2. Update Payment & Order Status in Transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update Payment
            const payment = await tx.payments.update({
                where: { razorpay_order_id },
                data: {
                    razorpay_payment_id,
                    razorpay_signature,
                    status: "CAPTURED",
                },
            });

            // Update Order
            await tx.orders.update({
                where: { id: payment.order_id },
                data: {
                    payment_status: "SUCCESS",
                    order_status: "CONFIRMED",
                },
            });

            return payment;
        });

        res.status(200).json({
            success: true,
            message: "Payment verified and order confirmed",
        });
    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    createPaymentOrder,
    verifyPayment,
};
