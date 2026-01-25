const { addToCartSchema, placeOrderSchema } = require("../../routes/schema");
const orderService = require("../../services/order.service");

exports.addToCart = async (req, res) => {
  try {
    const { error, value } = addToCartSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const result = await orderService.addToCart(req.user.user_id, value);
    res.status(200).json({ message: "Added to cart", data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { variant_id } = req.params;

    const result = await orderService.removeFromCart(req.user.user_id, variant_id);
    res.status(200).json({ message: "Removed from cart", data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { error, value } = placeOrderSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const orders = await orderService.placeOrder(req.user.user_id, value);
    res.status(201).json({ message: "Orders placed successfully", data: orders });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.json({ data: orders });
};
