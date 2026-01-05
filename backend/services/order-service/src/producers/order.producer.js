const { producer } = require("../config/kafka");

exports.sendOrderCreatedEvent = async (order) => {
  await producer.send({
    topic: "order_created",
    messages: [
      {
        value: JSON.stringify({
          order_id: order.id,
          user_id: order.user_id,
          restaurant_id: order.restaurant_id,
          total_amount: order.total_amount,
        }),
      },
    ],
  });
};
