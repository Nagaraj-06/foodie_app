const { PrismaClient } = require("../../generated/prisma"); // fix path
const prisma = new PrismaClient();

module.exports = prisma;
