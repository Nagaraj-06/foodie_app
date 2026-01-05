const prisma = require("../config/db");

async function updateRestaurantFull(ownerUserId, data) {
  return await prisma.$transaction(async (tx) => {
    let addressId;

    // 1️⃣ Create address if provided
    if (data.address) {
      const address = await tx.addresses.create({
        data: {
          user_id: ownerUserId,
          address_type: "Work",
          street_address: data.address.street_address,
          city: data.address.city,
          state: data.address.state,
          zip_code: data.address.zip_code,
          country_name: data.address.country_name,
          is_active: true,
        },
      });

      addressId = address.id;
    }

    // 2️⃣ Update restaurant with new address_id
    const restaurant = await tx.restaurants.update({
      where: { owner_user_id: ownerUserId },
      data: {
        restaurant_name: data.restaurant_name,
        photo: data.photo,
        address_id: addressId,
      },
    });

    // 2. Documents
    if (data.documents?.length) {
      await tx.restaurant_documents.deleteMany({
        where: { restaurant_id: restaurant.id },
      });

      await tx.restaurant_documents.createMany({
        data: data.documents.map((doc) => ({
          restaurant_id: restaurant.id,
          document_category_id: doc.document_category_id,
          document_url: doc.document_url,
          status: doc.status,
        })),
      });
    }

    // 3. Bank Details (upsert)
    if (data.bank_details) {
      await tx.restaurant_bank_details.upsert({
        where: {
          restaurant_id: restaurant.id,
        },
        update: {
          ...data.bank_details,
        },
        create: {
          restaurant_id: restaurant.id,
          ...data.bank_details,
        },
      });
    }

    return restaurant;
  });
}

async function addMenuItemWithVariants(data) {
  return await prisma.$transaction(async (tx) => {
    // Create the menu item
    const item = await tx.restaurant_items.create({
      data: {
        restaurant_id: data.restaurant_id,
        category_id: data.category_id,
        name: data.name,
        food_type: data.food_type,
        description: data.description,
        photo: data.photo,
      },
    });

    // Create variants
    const variantsData = data.variants.map((v) => ({
      item_id: item.id,
      name: v.name,
      price: v.price,
    }));

    await tx.restaurant_item_variants.createMany({
      data: variantsData,
    });

    return item;
  });
}

module.exports = { updateRestaurantFull, addMenuItemWithVariants };
