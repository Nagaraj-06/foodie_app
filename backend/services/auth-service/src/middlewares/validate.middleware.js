module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body); // using Joi or Zod
  if (error) {
    console.log(error.details);

    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};
