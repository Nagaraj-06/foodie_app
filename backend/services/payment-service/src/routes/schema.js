const Joi = require("joi");

const createIntentSchema = Joi.object({
    order_id: Joi.string().required(),
});

const confirmPaymentSchema = Joi.object({
    payment_intent_id: Joi.string().required(),
});

const createCheckoutSessionSchema = Joi.object({
    order_id: Joi.string().required(),
    success_url: Joi.string().uri().required(),
    cancel_url: Joi.string().uri().required(),
});

module.exports = {
    createIntentSchema,
    confirmPaymentSchema,
    createCheckoutSessionSchema,
};
