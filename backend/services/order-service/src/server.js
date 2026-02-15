const app = require("./app");
const { PORT } = require("./config/env");
const { connectKafka } = require("./config/kafka");
const { startPaymentConsumer } = require("./consumers/payment.consumer");

async function startServer() {
  // Start HTTP server immediately so health checks and Nginx work
  app.listen(PORT, () => console.log(`Order service running on ${PORT}`));

  // Connect to Kafka in the background with retries
  let connected = false;
  let attempts = 0;
  while (!connected && attempts < 10) {
    try {
      attempts++;
      console.log(`Attempting to connect to Kafka (Attempt ${attempts})...`);
      await connectKafka();
      await startPaymentConsumer();
      console.log("Connected to Kafka and started consumer");
      connected = true;
    } catch (err) {
      console.error(`Kafka connection failed (Attempt ${attempts}):`, err.message);
      if (attempts < 10) {
        console.log("Retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error("Max Kafka connection attempts reached. Service will run without Kafka integration.");
      }
    }
  }
}

startServer();
