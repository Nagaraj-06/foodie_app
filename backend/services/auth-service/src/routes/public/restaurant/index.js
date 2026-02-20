const express = require("express");
const router = express.Router();
const {
    getAllRestaurantsController,
    getRestaurantMenuController,
    getMenuItemController,
} = require("../../../controller/restaurant");

/**
 * @swagger
 * /public/api/restaurant:
 *   get:
 *     summary: Fetch all approved restaurants
 *     tags: [Restaurant]
 *     responses:
 *       200:
 *         description: Restaurants fetched
 */
router.get("/", getAllRestaurantsController);

/**
 * @swagger
 * /public/api/restaurant/{id}/menu:
 *   get:
 *     summary: Fetch the menu for a restaurant
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Menu fetched
 */
router.get("/:id/menu", getRestaurantMenuController);

/**
 * @swagger
 * /public/api/restaurant/item/{itemId}:
 *   get:
 *     summary: Fetch a single menu item with variants
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Item fetched
 */
router.get("/item/:itemId", getMenuItemController);

module.exports = router;
