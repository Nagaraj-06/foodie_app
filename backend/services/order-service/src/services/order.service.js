const prisma = require("../config/db");
const {
  sendOrderCreatedEvent,
  sendItemAddedToCartEvent,
  sendItemRemovedFromCartEvent
} = require("../producers/order.producer");

exports.removeFromCart = async (userId, variantId) => {

  const result = await prisma.cart.delete({
    where: {
      user_id_variant_id: {
        user_id: userId,
        variant_id: variantId,
      },
    },
  });

  // 🔥 Event Driven
  await sendItemRemovedFromCartEvent(userId, variantId);

  return result;
};

exports.addToCart = async (userId, data) => {
  const variant = await prisma.restaurant_item_variants.findUnique({
    where: { id: data.variant_id },
  });

  if (!variant) throw new Error("Item variant not found");

  const cartItem = await prisma.cart.upsert({
    where: {
      user_id_variant_id: {
        user_id: userId,
        variant_id: data.variant_id,
      },
    },
    update: {
      quantity: { increment: data.quantity },
    },
    create: {
      user_id: userId,
      variant_id: data.variant_id,
      quantity: data.quantity,
    },
  });

  // 🔥 Event Driven
  await sendItemAddedToCartEvent(userId, data);

  return cartItem;
};

exports.placeOrder = async (userId, data) => {
  return prisma.$transaction(async (tx) => {
    const { payment_method, items } = data;

    // Fetch variant details to get prices and restaurant_id
    const variantIds = items.map(item => item.variant_id);
    const variants = await tx.restaurant_item_variants.findMany({
      where: { id: { in: variantIds } },
      include: {
        item: {
          select: { restaurant_id: true }
        }
      }
    });

    if (variants.length !== variantIds.length) {
      throw new Error("One or more item variants not found");
    }

    // Group items by restaurant_id
    const itemsByRestaurant = {};
    items.forEach(reqItem => {
      const variant = variants.find(v => v.id === reqItem.variant_id);
      const restaurantId = variant.item.restaurant_id;

      if (!itemsByRestaurant[restaurantId]) {
        itemsByRestaurant[restaurantId] = [];
      }

      itemsByRestaurant[restaurantId].push({
        ...reqItem,
        unit_price: variant.price,
        total_price: variant.price * reqItem.quantity
      });
    });

    const createdOrders = [];

    // Create an order for each restaurant
    for (const restaurantId in itemsByRestaurant) {
      const restaurantItems = itemsByRestaurant[restaurantId];
      const totalAmount = restaurantItems.reduce((sum, item) => sum + item.total_price, 0);

      const order = await tx.orders.create({
        data: {
          user_id: userId,
          restaurant_id: restaurantId,
          total_amount: totalAmount,
          order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          payment_method: payment_method,
          payment_status: "PENDING",
          order_status: "CREATED",
        },
      });

      const orderItemsData = restaurantItems.map((item) => ({
        order_id: order.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));

      await tx.order_items.createMany({ data: orderItemsData });

      createdOrders.push(order);

      // 🔥 Event Driven for each order
      await sendOrderCreatedEvent(order);
    }

    // Optional: Clear items from cart if they were ordered
    await tx.cart.deleteMany({
      where: {
        user_id: userId,
        variant_id: { in: variantIds }
      }
    });

    return createdOrders;
  });
};

exports.getUserOrders = async (userId) => {
  return prisma.orders.findMany({
    where: { user_id: userId },
    include: { order_items: true },
    orderBy: { created_at: "desc" },
  });
};
