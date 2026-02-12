const {
  updateUserProfileSchema,
} = require("../../routes/private/users/schema");
const {
  getUserProfile,
  updateUser,
  updateRestaurant,
} = require("../../services/user.service");

async function getProfile(req, res) {
  try {
    const user_id = req.user.user_id;
    const profile = await getUserProfile(user_id);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

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
  getProfile,
  updateUserProfile,
};
