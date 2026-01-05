const { addToCartSchema, placeOrderSchema } = require("../../routes/schema");
const orderService = require("../../services/order.service");

exports.addToCart = async (req, res) => {
  try {
    const { error, value } = addToCartSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const result = await orderService.addToCart(req.user.id, value);
    res.status(200).json({ message: "Added to cart", data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { error, value } = placeOrderSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const order = await orderService.placeOrder(req.user.id, value);
    res.status(201).json({ message: "Order placed", data: order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.json({ data: orders });
};
