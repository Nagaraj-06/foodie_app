const express = require("express");
const authMiddleware = require("../../../middlewares/auth.middleware");
const { updateUserProfile, addUserAddress } = require("../../../controller/user");
const {
    updateUserProfileSchema,
    addAddressSchema,
} = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

const router = express.Router();

router.use(authMiddleware());

router.put("/profile", validate(updateUserProfileSchema), updateUserProfile);
router.post("/address", validate(addAddressSchema), addUserAddress);

module.exports = router;
