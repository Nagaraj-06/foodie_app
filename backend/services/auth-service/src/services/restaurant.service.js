const { prisma } = require("@foodie-app/prisma-client");

/**
 * Handles the complete registration of a restaurant and its owner.
 * @param {Object} registrationData - Data from the registration form.
 * @param {Object} files - Uploaded files (FSSAI, PAN, GST).
 */
async function registerRestaurantService(registrationData, files) {
  const {
    businessName,
    phone,
    email,
    ownerName,
    location,
    accountHolder,
    accountNumber,
    ifsc,
    bankName,
  } = registrationData;

  // 1. Get role ID for restaurant_owner
  const ownerRole = await prisma.roles_master.findUnique({
    where: { name: "restaurant_owner" },
  });

  if (!ownerRole) {
    throw new Error("Restaurant owner role not configured");
  }

  // 2. Get document categories
  const docCategories = await prisma.document_category_master.findMany({
    where: { name: { in: ["FSSAI", "PAN", "GST"] } },
  });

  const categoryMap = docCategories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {});

  return await prisma.$transaction(async (tx) => {
    // 3. Create or Update user
    // Split ownerName into first/last name if possible
    const nameParts = ownerName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || null;

    let user = await tx.users.upsert({
      where: { email },
      update: {
        role_id: ownerRole.id,
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
      },
      create: {
        email,
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
        role_id: ownerRole.id,
      },
    });

    // 4. Create Restaurant
    const restaurant = await tx.restaurants.create({
      data: {
        owner_user_id: user.id,
        restaurant_name: businessName,
        // photo: null, // Initial photo could be added later or as a separate field
        verification_status: false,
      },
    });

    // 5. Create Bank Details
    await tx.restaurant_bank_details.create({
      data: {
        restaurant_id: restaurant.id,
        account_holder_name: accountHolder,
        account_number: accountNumber,
        ifsc_code: ifsc,
        bank_name: bankName,
      },
    });

    // 6. Save Documents
    const documentRecords = [];
    if (files.fssai) {
      documentRecords.push({
        restaurant_id: restaurant.id,
        document_category_id: categoryMap["FSSAI"],
        document_url: files.fssai[0].path || files.fssai[0].filename, // Adjust based on upload middleware
      });
    }
    if (files.pan) {
      documentRecords.push({
        restaurant_id: restaurant.id,
        document_category_id: categoryMap["PAN"],
        document_url: files.pan[0].path || files.pan[0].filename,
      });
    }
    if (files.gst) {
      documentRecords.push({
        restaurant_id: restaurant.id,
        document_category_id: categoryMap["GST"],
        document_url: files.gst[0].path || files.gst[0].filename,
      });
    }

    if (documentRecords.length > 0) {
      await tx.restaurant_documents.createMany({
        data: documentRecords,
      });
    }

    return { user, restaurant };
  });
}

/**
 * Adds a new menu item with its variants.
 * @param {Object} itemData - Item details (restaurant_id, category_id, name, food_type, description, photo, variants).
 */
async function addMenuItemWithVariants(itemData) {
  const {
    restaurant_id,
    category_id,
    name,
    food_type,
    description,
    photo,
    variants,
  } = itemData;

  return await prisma.$transaction(async (tx) => {
    // 1. Create the menu item
    const item = await tx.restaurant_items.create({
      data: {
        restaurant_id,
        category_id,
        name,
        food_type,
        description,
        photo,
      },
    });

    // 2. Create variants
    if (variants && variants.length > 0) {
      const variantData = variants.map((v) => ({
        item_id: item.id,
        name: v.name,
        price: parseFloat(v.price),
      }));

      await tx.restaurant_item_variants.createMany({
        data: variantData,
      });
    }

    // Return item with variants
    return await tx.restaurant_items.findUnique({
      where: { id: item.id },
      include: {
        restaurant_item_variants: true,
      },
    });
  });
}

/**
 * Lists all active item categories.
 */
async function listCategories() {
  return await prisma.item_category_master.findMany({
    where: { is_active: true },
    orderBy: { name: "asc" },
  });
}

/**
 * Fetches all approved and active restaurants.
 */
async function getAllRestaurantsDiscovery() {
  return await prisma.restaurants.findMany({
    where: {
      verification_status: "APPROVED",
      is_active: true,
    },
    include: {
      address: true,
    },
    orderBy: {
      restaurant_name: "asc",
    },
  });
}

/**
 * Fetches the menu for a specific restaurant, organized by categories.
 * @param {string} restaurantId - The UUID of the restaurant.
 */
async function getRestaurantMenuDiscovery(restaurantId) {
  // Fetch all items with their variants for this restaurant
  const items = await prisma.restaurant_items.findMany({
    where: {
      restaurant_id: restaurantId,
    },
    include: {
      category: true,
      restaurant_item_variants: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Group items by category
  const categoriesMap = items.reduce((acc, item) => {
    const categoryName = item.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = {
        id: item.category.id,
        name: categoryName,
        items: [],
      };
    }
    acc[categoryName].items.push(item);
    return acc;
  }, {});

  return Object.values(categoriesMap);
}

/**
 * Fetches a single menu item with its variants.
 * @param {string} itemId - The UUID of the menu item.
 */
async function getMenuItemDiscovery(itemId) {
  return await prisma.restaurant_items.findUnique({
    where: {
      id: itemId,
    },
    include: {
      restaurant_item_variants: true,
      category: true,
    },
  });
}

module.exports = {
  registerRestaurantService,
  addMenuItemWithVariants,
  listCategories,
  getAllRestaurantsDiscovery,
  getRestaurantMenuDiscovery,
  getMenuItemDiscovery,
};
