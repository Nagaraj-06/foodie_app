async function createMasterItems(prisma) {
  console.log("seeding item category master...");

  const data = [
    {
      name: "Beverages",
      is_active: true,
    },
    {
      name: "Fast Food",
      is_active: true,
    },
    {
      name: "Desserts",
      is_active: true,
    },
    {
      name: "Main Course",
      is_active: true,
    },
    {
      name: "Snacks",
      is_active: true,
    },
    {
      name: "Salads",
      is_active: true,
    },
    {
      name: "Bakery",
      is_active: true,
    },
    {
      name: "Seafood",
      is_active: true,
    },
    {
      name: "Vegetarian",
      is_active: true,
    },
    {
      name: "Non-Vegetarian",
      is_active: true,
    },
  ];

  await prisma.item_category_master.createMany({
    data,
    skipDuplicates: true,
  });
}

module.exports = createMasterItems;
