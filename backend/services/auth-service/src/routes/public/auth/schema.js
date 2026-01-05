const Joi = require("joi");

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signInResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  message: Joi.string().example("Login successful"),
  user: Joi.object({
    id: Joi.string().example("e3a1f93c-5d8f-4c4b-a7c9-8c12dca29a0e"),
    email: Joi.string().email().example("user@example.com"),
  }),
  token: Joi.string().example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."),
});

const sendOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  role_id: Joi.string().required(),
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  otp: Joi.string().length(6).required(),
  role_id: Joi.string().required(),
});

const otpLoginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
});

const googleLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  role_id: Joi.number().valid(2, 3).required(),
});

module.exports = {
  signInSchema,
  signInResponseSchema,
  sendOtpSchema,
  otpLoginSchema,
  verifyOtpSchema,
  googleLoginSchema,
};
