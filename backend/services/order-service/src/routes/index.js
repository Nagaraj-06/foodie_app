const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { addToCart, placeOrder, getMyOrders } = require("../controller/orders");

router.use(authMiddleware());

router.post("/cart/add", addToCart);
router.post("/place", placeOrder);
router.get("/my-orders", getMyOrders);

module.exports = router;
