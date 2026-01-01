const { PrismaClient } = require("../../generated/prisma"); // fix path
const prisma = new PrismaClient();
const dotenv = require("dotenv");

dotenv.config(); // Loads DATABASE_URL (and other vars) from ../.env

module.exports = prisma;
