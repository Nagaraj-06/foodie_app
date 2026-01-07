require("dotenv").config(); // Load .env

module.exports = {
  PORT: process.env.PORT || 3002,
  KAFKA_BROKER: process.env.KAFKA_BROKER,
  JWT_SECRET: process.env.JWT_SECRET,
};
