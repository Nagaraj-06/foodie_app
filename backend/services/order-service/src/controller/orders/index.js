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
  try {
    const orders = await orderService.getUserOrders(req.user.user_id);
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRestaurantOrderHistory = async (req, res) => {
  try {
    const { period } = req.query;
    const history = await orderService.getRestaurantOrderHistory(req.user.user_id, period);
    res.json({ success: true, data: history });
  } catch (err) {
    const status = err.message.includes("not found") ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};
