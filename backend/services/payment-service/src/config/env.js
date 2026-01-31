require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 3003,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    HOST: process.env.HOST || "localhost",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    KAFKA_BROKER: process.env.KAFKA_BROKER || "localhost:9092",
};
