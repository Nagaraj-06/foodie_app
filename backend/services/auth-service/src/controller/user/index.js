const {
  updateUserProfileSchema,
  addAddressSchema,
} = require("../../routes/private/users/schema");
const {
  updateUser,
  createUserAddress,
  updateRestaurant,
} = require("../../services/user.service");

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

async function addUserAddress(req, res) {
  const { error, value } = addAddressSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const user_id = req.user.user_id;

  const newAddress = await createUserAddress(user_id, value);

  res.status(201).json({
    message: "Address added successfully",
    data: newAddress,
  });
}

module.exports = {
  updateUserProfile,
  addUserAddress,
};
