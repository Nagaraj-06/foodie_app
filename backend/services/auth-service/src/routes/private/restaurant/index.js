const express = require("express");
const upload = require("../../../middlewares/upload.middleware");

const authMiddleware = require("../../../middlewares/auth.middleware");
const {
  updateRestaurantController,
  addMenuItemController,
  getCategoriesController,
} = require("../../../controller/restaurant");
const { updateRestaurantSchema } = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

const router = express.Router();
router.use(authMiddleware());

/**
 * @swagger
 * /private/api/restaurant/update:
 *   put:
 *     summary: Update restaurant profile
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRestaurant'
 *     responses:
 *       200:
 *         description: Restaurant updated
 */
router.put(
  "/update",
  validate(updateRestaurantSchema),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  updateRestaurantController
);

/**
 * @swagger
 * /private/api/restaurant/menu-item:
 *   post:
 *     summary: Add a new menu item
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddMenuItem'
 *     responses:
 *       201:
 *         description: Menu item added
 */
router.post("/menu-item", upload.single("photo"), addMenuItemController);

/**
 * @swagger
 * /private/api/restaurant/categories:
 *   get:
 *     summary: Fetch all item categories
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories fetched
 */
router.get("/categories", getCategoriesController);

module.exports = router;
