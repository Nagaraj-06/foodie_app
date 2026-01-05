const express = require("express");
const upload = require("../../../middlewares/upload.middleware");

const authMiddleware = require("../../../middlewares/auth.middleware");
const {
  updateRestaurantController,
  addMenuItemController,
} = require("../../../controller/restaurant");
const { updateRestaurantSchema } = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

const router = express.Router();
router.use(authMiddleware());

router.put(
  "/update",
  validate(updateRestaurantSchema),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  updateRestaurantController
);

router.post("/menu-item", addMenuItemController);

module.exports = router;
