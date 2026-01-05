const { prisma } = require(".");
require("dotenv").config();

const createMasterRoles = require("./seed/master_role");
const createMasterItems = require("./seed/master_item_category");
const createMasterDocsCategory = require("./seed/master_document_category");

async function main() {
  await createMasterRoles(prisma);
  await createMasterItems(prisma);
  await createMasterDocsCategory(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
