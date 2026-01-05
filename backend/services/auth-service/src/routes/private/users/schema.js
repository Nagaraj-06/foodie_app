const Joi = require("joi");

const updateUserProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(30).optional(),
  last_name: Joi.string().min(2).max(30).optional(),
  phone_number: Joi.string().min(10).max(15).optional(),
  email: Joi.string().email().max(100).optional(),
}).min(1); // at least one field required

module.exports = {
  updateUserProfileSchema,
};
