const Redis = require("ioredis");
const { redisUrl: REDIS_URL } = require("./env");

console.log("Connecting to Redis:", REDIS_URL?.replace(/:\w+@/, ":***@"));

console.log("Connecting to Redis:", REDIS_URL);

const redis = new Redis(REDIS_URL);

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error", err));

module.exports = redis;
