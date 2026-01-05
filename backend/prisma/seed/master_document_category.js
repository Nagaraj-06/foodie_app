async function createMasterDocsCategory(prisma) {
  console.log("seeding document category master...");

  const data = [
    {
      name: "FSSAI",
      is_mandatory: true,
      is_active: true,
    },
    {
      name: "PAN",
      is_mandatory: true,
      is_active: true,
    },
    {
      name: "GST",
      is_mandatory: false,
      is_active: true,
    },
  ];

  await prisma.document_category_master.createMany({
    data,
    skipDuplicates: true,
  });
}

module.exports = createMasterDocsCategory;
