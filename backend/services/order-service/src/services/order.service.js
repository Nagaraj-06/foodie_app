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

exports.updateCartItemQuantity = async (userId, data) => {
  const { variant_id, quantity } = data;

  if (quantity <= 0) {
    return await prisma.cart.delete({
      where: {
        user_id_variant_id: {
          user_id: userId,
          variant_id: variant_id,
        },
      },
    });
  }

  return await prisma.cart.update({
    where: {
      user_id_variant_id: {
        user_id: userId,
        variant_id: variant_id,
      },
    },
    data: { quantity },
  });
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
  const orders = await prisma.orders.findMany({
    where: { user_id: userId },
    include: {
      order_items: {
        include: {
          variant: {
            include: { item: true }
          }
        }
      }
    },
    orderBy: { created_at: "desc" },
  });

  return orders.map(order => {
    // Map internal status to display status
    let displayStatus = "IN_PROGRESS";
    if (order.order_status === "DELIVERED") displayStatus = "COMPLETED";
    else if (order.order_status === "CANCELLED") displayStatus = "CANCELLED";
    else if (order.order_status === "REFUNDED") displayStatus = "REFUNDED";

    // Format item details (e.g., "Pepperoni Pizza + 1 item")
    const firstItem = order.order_items[0]?.variant?.item?.name || "Unknown Item";
    const extraCount = order.order_items.length - 1;
    const itemSummary = extraCount > 0 ? `${firstItem} + ${extraCount} item` : firstItem;

    return {
      id: order.id,
      order_number: order.order_number,
      display_status: displayStatus,
      status: order.order_status,
      item_summary: itemSummary,
      total_amount: order.total_amount,
      created_at: order.created_at,
      // Frontend can format this as "Aug 23, 2024 at 12:30 PM"
    };
  });
};

exports.getRestaurantOrderHistory = async (ownerId, period = "month") => {
  // 0. Find all restaurants associated with owner to handle potential ID mismatches or multiple branches
  const userRestaurants = await prisma.restaurants.findMany({
    where: { owner_user_id: ownerId },
    select: { id: true, restaurant_name: true }
  });

  if (userRestaurants.length === 0) {
    throw new Error("Restaurant not found for this owner");
  }

  const restaurantIds = userRestaurants.map(r => r.id);
  const now = new Date();

  // Use UTC dates to avoid timezone discrepancies with DB storage
  const startOfCurrentUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const startOfLastUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));

  // 1. Fetch orders for analytics across all owned restaurants
  const orders = await prisma.orders.findMany({
    where: {
      restaurant_id: { in: restaurantIds },
      created_at: { gte: startOfLastUTC }
    },
    include: {
      order_items: true,
      user: { select: { first_name: true, last_name: true } }
    },
    orderBy: { created_at: "desc" }
  });

  const currentOrders = orders.filter(o => new Date(o.created_at) >= startOfCurrentUTC);
  const lastOrders = orders.filter(o => new Date(o.created_at) < startOfCurrentUTC);

  // 2. Calculate Stats
  const calculateStats = (orderList) => {
    const revenue = orderList.reduce((sum, o) => sum + (o.payment_status === "SUCCESS" ? o.total_amount : 0), 0);
    const count = orderList.length;
    const avgValue = count > 0 ? revenue / count : 0;
    return { revenue, count, avgValue };
  };

  const currentStats = calculateStats(currentOrders);
  const lastStats = calculateStats(lastOrders);

  const calcDiff = (curr, prev) => prev > 0 ? ((curr - prev) / prev) * 100 : 0;

  return {
    summary: {
      total_revenue: {
        value: currentStats.revenue,
        diff: calcDiff(currentStats.revenue, lastStats.revenue)
      },
      total_orders: {
        value: currentStats.count,
        diff: calcDiff(currentStats.count, lastStats.count)
      },
      avg_order_value: {
        value: currentStats.avgValue,
        diff: calcDiff(currentStats.avgValue, lastStats.avgValue)
      }
    },
    recent_orders: currentOrders.slice(0, 6).map(o => ({
      id: o.id,
      order_number: o.order_number,
      customer: `${o.user.first_name} ${o.user.last_name}`,
      amount: o.total_amount,
      status: o.order_status,
      created_at: o.created_at
    }))
  };
};

exports.getUserCart = async (userId) => {
  return await prisma.cart.findMany({
    where: { user_id: userId },
    include: {
      variant: {
        include: {
          item: {
            include: {
              restaurant: true
            }
          }
        }
      }
    }
  });
};

module.exports = {
  removeFromCart: exports.removeFromCart,
  addToCart: exports.addToCart,
  placeOrder: exports.placeOrder,
  getUserOrders: exports.getUserOrders,
  getRestaurantOrderHistory: exports.getRestaurantOrderHistory,
  getUserCart: exports.getUserCart,
  updateCartItemQuantity: exports.updateCartItemQuantity,
};
