const Joi = require("joi");

const addressSchema = Joi.object({
  address_type: Joi.string().max(30).required(),
  street_address: Joi.string().max(100).required(),
  city: Joi.string().max(30).required(),
  state: Joi.string().max(30).required(),
  zip_code: Joi.string().max(30).required(),
  country_name: Joi.string().max(30).required(),
});

const updateUserProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(30).optional(),
  last_name: Joi.string().min(1).max(30).optional(),
  phone_number: Joi.string().min(10).max(15).optional(),
  email: Joi.string().email().max(100).optional(),
  address: addressSchema.optional(),
}).min(1); // at least one field required

const addAddressSchema = addressSchema;

module.exports = {
  updateUserProfileSchema,
  addAddressSchema,
};
