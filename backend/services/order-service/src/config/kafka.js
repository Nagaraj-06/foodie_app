const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "order-service",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "order-group" });

async function connectKafka() {
  await producer.connect();
  await consumer.connect();
}

module.exports = {
  producer,
  consumer,
  connectKafka,
};
