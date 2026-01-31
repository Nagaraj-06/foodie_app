const { Kafka } = require("kafkajs");
const { KAFKA_BROKER } = require("./env");

const kafka = new Kafka({
    clientId: "payment-service",
    brokers: [KAFKA_BROKER],
});

const producer = kafka.producer();
// Consumer might be needed if we listen for ORDER_CREATED
const consumer = kafka.consumer({ groupId: "payment-group" });

async function connectKafka() {
    await producer.connect();
    console.log("Payment Service Kafka Producer Connected");
    await consumer.connect();
    console.log("Payment Service Kafka Consumer Connected");
}

module.exports = {
    producer,
    consumer,
    connectKafka,
};
