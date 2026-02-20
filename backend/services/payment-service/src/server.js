const app = require("./app");
const { PORT } = require("./config/env");
const { connectKafka } = require("./config/kafka");
const { startOrderConsumer } = require("./consumers/order.consumer");

async function bootstrap() {
    await connectKafka();
    await startOrderConsumer(); // Listen for order_created → create Stripe session
    app.listen(PORT, () => {
        console.log(`Payment Service listening on port ${PORT}`);
    });
}

bootstrap().catch((err) => {
    console.error("❌ Failed to start Payment Service:", err);
    process.exit(1);
});
