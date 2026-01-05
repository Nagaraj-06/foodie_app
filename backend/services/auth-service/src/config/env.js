require("dotenv").config(); // Load .env

module.exports = {
  port: process.env.PORT || 3001,
  dbUrl: process.env.DATABASE_URL,
  host: process.env.HOST,
  redisUrl: process.env.REDIS_URL,
  FAST2SMS_API_KEY: process.env.FAST2SMS_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN,
};
