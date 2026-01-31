const Joi = require("joi");

const createIntentSchema = Joi.object({
    order_id: Joi.string().required(),
});

const confirmPaymentSchema = Joi.object({
    payment_intent_id: Joi.string().required(),
});

module.exports = {
    createIntentSchema,
    confirmPaymentSchema,
};
