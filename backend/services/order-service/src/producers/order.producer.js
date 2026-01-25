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

exports.sendItemAddedToCartEvent = async (userId, data) => {
  await producer.send({
    topic: "item_added_to_cart",
    messages: [
      {
        value: JSON.stringify({
          user_id: userId,
          variant_id: data.variant_id,
          quantity: data.quantity,
          timestamp: new Date().toISOString(),
        }),
      },
    ],
  });
};

exports.sendItemRemovedFromCartEvent = async (userId, variantId) => {
  await producer.send({
    topic: "item_removed_from_cart",
    messages: [
      {
        value: JSON.stringify({
          user_id: userId,
          variant_id: variantId,
          timestamp: new Date().toISOString(),
        }),
      },
    ],
  });
};
