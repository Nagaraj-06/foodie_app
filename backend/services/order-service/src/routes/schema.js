const Joi = require("joi");

exports.addToCartSchema = Joi.object({
  variant_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

exports.placeOrderSchema = Joi.object({
  restaurant_id: Joi.string().uuid().required(),
  payment_method: Joi.string().valid("ONLINE", "COD").required(),
});
