const app = require("./app");
const { PORT } = require("./config/env");
const { connectKafka } = require("./config/kafka");
const { startPaymentConsumer } = require("./consumers/payment.consumer");

async function startServer() {
  try {
    await connectKafka();
    console.log("Connected to Kafka");

    await startPaymentConsumer();
    console.log("Payment consumer started");

    app.listen(PORT, () => console.log(`Order service running on ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
