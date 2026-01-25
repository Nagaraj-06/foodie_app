const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { addToCart, removeFromCart, placeOrder, getMyOrders } = require("../controller/orders");

router.use(authMiddleware());

router.post("/private/api/order/cart/add", addToCart);
router.delete("/private/api/order/cart/:variant_id", removeFromCart);
router.post("/private/api/order/place", placeOrder);
router.get("/private/api/order/my-orders", getMyOrders);

module.exports = router;
