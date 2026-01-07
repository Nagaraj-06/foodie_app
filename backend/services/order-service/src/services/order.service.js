const prisma = require("../config/db");
const { sendOrderCreatedEvent } = require("../producers/order.producer");

exports.addToCart = async (userId, data) => {
  const variant = await prisma.restaurant_item_variants.findUnique({
    where: { id: data.variant_id },
  });

  if (!variant) throw new Error("Item variant not found");

  return prisma.cart.upsert({
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
};

exports.placeOrder = async (userId, data) => {
  return prisma.$transaction(async (tx) => {
    const cartItems = await tx.cart.findMany({
      where: { user_id: userId },
      include: { variant: true },
    });

    if (!cartItems.length) throw new Error("Cart is empty");

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );

    const order = await tx.orders.create({
      data: {
        user_id: userId,
        restaurant_id: data.restaurant_id,
        total_amount: totalAmount,
        order_number: `ORD-${Date.now()}`,
        payment_method: data.payment_method,
        payment_status: "PENDING",
        order_status: "CREATED",
      },
    });

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.variant.price,
      total_price: item.variant.price * item.quantity,
    }));

    await tx.order_items.createMany({ data: orderItems });
    await tx.cart.deleteMany({ where: { user_id: userId } });

    // 🔥 Event Driven
    await sendOrderCreatedEvent(order);

    return order;
  });
};

exports.getUserOrders = async (userId) => {
  return prisma.orders.findMany({
    where: { user_id: userId },
    include: { items: true },
    orderBy: { created_at: "desc" },
  });
};
