const Joi = require("joi");

const updateRestaurantSchema = Joi.object({
  restaurant_name: Joi.string().min(2).max(30).optional(),
  address: Joi.object({
    street_address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zip_code: Joi.string().optional(),
    country_name: Joi.string().optional(),
  }).optional(),
  photo: Joi.string().optional(),

  documents: Joi.array()
    .items(
      Joi.object({
        document_category_id: Joi.string().uuid().required(),
        document_url: Joi.string().required(),
      })
    )
    .optional(),

  bank_details: Joi.object({
    account_holder_name: Joi.string().required(),
    account_number: Joi.string().required(),
    ifsc_code: Joi.string().required(),
    bank_name: Joi.string().required(),
  }).optional(),
});

const addMenuItemSchema = Joi.object({
  restaurant_id: Joi.string().uuid().required(),
  category_id: Joi.string().uuid().required(),
  name: Joi.string().min(2).max(50).required(),
  food_type: Joi.string().valid("VEG", "NON_VEG").required(),
  description: Joi.string().optional(),
  photo: Joi.string().optional(),
  variants: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        price: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
});

module.exports = { updateRestaurantSchema, addMenuItemSchema };
