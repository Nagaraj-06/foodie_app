const Joi = require("joi");

exports.addToCartSchema = Joi.object({
  variant_id: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

exports.placeOrderSchema = Joi.object({
  payment_method: Joi.string().valid("ONLINE", "COD").required(),
  items: Joi.array().items(
    Joi.object({
      variant_id: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
});

exports.removeFromCartSchema = Joi.object({
  variant_id: Joi.string().uuid().required(),
});
