const express = require("express");
const authMiddleware = require("../../../middlewares/auth.middleware");
const { updateUserProfile } = require("../../../controller/user");
const { updateUserProfileSchema, updateRestaurantSchema } = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

const router = express.Router();

router.use(authMiddleware());

router.put("/profile", validate(updateUserProfileSchema), updateUserProfile);

module.exports = router;
