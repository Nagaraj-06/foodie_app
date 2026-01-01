const { prisma } = require("./index.js");

async function test() {
  console.log("✅ Prisma loaded successfully");
  await prisma.$disconnect();
}

test().catch(console.error);
