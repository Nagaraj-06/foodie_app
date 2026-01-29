const express = require("express");
const authMiddleware = require("../../../middlewares/auth.middleware");
const { updateUserProfile } = require("../../../controller/user");
const {
    updateUserProfileSchema,
} = require("./schema");
const validate = require("../../../middlewares/validate.middleware");

const router = express.Router();

router.use(authMiddleware());

/**
 * @swagger
 * /private/api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put("/profile", validate(updateUserProfileSchema), updateUserProfile);

module.exports = router;
