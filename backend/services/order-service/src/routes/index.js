const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { addToCart, removeFromCart, placeOrder, getMyOrders, getRestaurantOrderHistory } = require("../controller/orders");

router.use(authMiddleware());

/**
 * @swagger
 * /private/api/order/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCart'
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Bad request
 */
router.post("/private/api/order/cart/add", addToCart);

/**
 * @swagger
 * /private/api/order/cart/{variant_id}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variant_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the variant to remove
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       400:
 *         description: Bad request
 */
router.delete("/private/api/order/cart/:variant_id", removeFromCart);

/**
 * @swagger
 * /private/api/order/place:
 *   post:
 *     summary: Place an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaceOrder'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Bad request
 */
router.post("/private/api/order/place", placeOrder);

/**
 * @swagger
 * /private/api/order/my-orders:
 *   get:
 *     summary: Get all orders for the current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/private/api/order/my-orders", getMyOrders);

/**
 * @swagger
 * /private/api/order/restaurant/history:
 *   get:
 *     summary: Get order history for the restaurant
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of restaurant orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/private/api/order/restaurant/history", getRestaurantOrderHistory);

module.exports = router;
