const prisma = require("../config/db.js");
const { consumer } = require("../config/kafka.js");

async function startPaymentConsumer() {
  await consumer.subscribe({ topic: "payment_success" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());

      await prisma.orders.update({
        where: { id: data.order_id },
        data: {
          payment_status: "SUCCESS",
          order_status: "CONFIRMED",
        },
      });
    },
  });
}

module.exports = {
  startPaymentConsumer,
};
