const {
  updateUserProfileSchema,
} = require("../../routes/private/users/schema");
const { updateUser, updateRestaurant } = require("../../services/user.service");
// const validate = require("../../middlewares/validate.middleware");

async function updateUserProfile(req, res) {
  const { error, value } = updateUserProfileSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const user_id = req.user.user_id; // from JWT

  const updatedUser = await updateUser(user_id, value);

  res.json({
    message: "Profile updated successfully",
    data: updatedUser,
  });
}

module.exports = {
  updateUserProfile,
};
