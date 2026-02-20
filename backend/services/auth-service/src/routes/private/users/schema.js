const Joi = require("joi");

const addressSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  address_type: Joi.string().max(30).required(),
  street_address: Joi.string().max(100).required(),
  city: Joi.string().max(30).required(),
  state: Joi.string().max(30).required(),
  zip_code: Joi.string().max(30).required(),
  country_name: Joi.string().max(30).required(),
  is_active: Joi.boolean().optional(),
}).unknown(true);

const updateUserProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(30).optional(),
  last_name: Joi.string().min(1).max(30).optional(),
  phone_number: Joi.string().min(10).max(15).optional(),
  email: Joi.string().email().max(100).optional(),
  avatar: Joi.string().optional(),
  addresses: Joi.array().items(addressSchema).optional(),
  restaurant_name: Joi.string().max(100).optional(),
  account_holder_name: Joi.string().max(100).optional(),
  account_number: Joi.string().max(50).optional(),
  ifsc_code: Joi.string().max(20).optional(),
  bank_name: Joi.string().max(100).optional(),
}).min(1);

module.exports = {
  updateUserProfileSchema,
};
