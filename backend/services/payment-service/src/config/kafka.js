const { Kafka } = require("kafkajs");
const { KAFKA_BROKER } = require("./env");

const kafka = new Kafka({
    clientId: "payment-service",
    brokers: [KAFKA_BROKER],
});

const producer = kafka.producer();

async function connectKafka() {
    await producer.connect();
    console.log("Payment Service Kafka Producer Connected");
}

module.exports = {
    producer,
    connectKafka,
};
