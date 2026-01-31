const { producer } = require("../config/kafka");

exports.sendPaymentSuccessEvent = async (data) => {
    try {
        await producer.send({
            topic: "payment_success",
            messages: [
                {
                    value: JSON.stringify({
                        order_id: data.order_id,
                        payment_id: data.id,
                        transaction_id: data.transaction_id,
                        timestamp: new Date().toISOString(),
                    }),
                },
            ],
        });
        console.log(`🚀 Sent payment_success event for order: ${data.order_id}`);
    } catch (error) {
        console.error("❌ Error sending payment_success event:", error);
    }
};
