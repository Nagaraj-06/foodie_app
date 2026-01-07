const { Kafka } = require("kafkajs");
const { KAFKA_BROKER } = require("./env");

const kafka = new Kafka({
  clientId: "order-service",
  brokers: [KAFKA_BROKER],
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
