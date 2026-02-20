const { prisma } = require("@foodie-app/prisma-client");

async function getUserProfile(user_id) {
  return await prisma.users.findUnique({
    where: { id: user_id },
    include: {
      addresses: {
        where: { is_active: true },
        orderBy: { created_at: "desc" },
      },
      role: true,
      restaurants: {
        include: {
          restaurant_bank_details: true,
          restaurant_documents: true,
        },
      },
    },
  });
}

async function updateUser(user_id, data) {
  const { addresses, ...userData } = data;

  const updateData = {
    ...userData,
  };

  if (addresses) {
    // 1. Fetch current active addresses from DB
    const currentActiveAddresses = await prisma.addresses.findMany({
      where: { user_id, is_active: true },
    });

    const incomingIds = addresses
      .filter((addr) => addr.id && addr.id.length === 36) // Simple check for UUID length
      .map((addr) => addr.id);

    // 2. Identify addresses to deactivate (soft-delete)
    const toDeactivate = currentActiveAddresses
      .filter((addr) => !incomingIds.includes(addr.id))
      .map((addr) => addr.id);

    if (toDeactivate.length > 0) {
      await prisma.addresses.updateMany({
        where: { id: { in: toDeactivate } },
        data: { is_active: false, deleted_at: new Date() },
      });
    }

    // 3. Process incoming addresses (create or update)
    for (const addr of addresses) {
      const { id, ...addressData } = addr;

      if (id && id.length === 36) {
        // Update existing
        await prisma.addresses.update({
          where: { id },
          data: { ...addressData, is_active: true, deleted_at: null },
        });
      } else {
        // Create new
        await prisma.addresses.create({
          data: {
            ...addressData,
            user_id,
            is_active: true,
          },
        });
      }
    }
  }

  if (userData.restaurant_name) {
    const currentRestaurant = await prisma.restaurants.findUnique({
      where: { owner_user_id: user_id },
    });

    await prisma.restaurants.upsert({
      where: { owner_user_id: user_id },
      update: {
        restaurant_name: userData.restaurant_name,
        verification_status: currentRestaurant?.verification_status === "REJECTED" ? "PENDING" : currentRestaurant?.verification_status
      },
      create: {
        owner_user_id: user_id,
        restaurant_name: userData.restaurant_name,
        verification_status: "PENDING"
      },
    });
    delete updateData.restaurant_name; // Remove from user table update data
  }

  // Handle Bank Details update
  if (userData.account_number || userData.account_holder_name || userData.ifsc_code || userData.bank_name) {
    const restaurant = await prisma.restaurants.findUnique({
      where: { owner_user_id: user_id },
    });

    if (restaurant) {
      await prisma.restaurant_bank_details.upsert({
        where: { restaurant_id: restaurant.id },
        update: {
          account_holder_name: userData.account_holder_name,
          account_number: userData.account_number,
          ifsc_code: userData.ifsc_code,
          bank_name: userData.bank_name,
        },
        create: {
          restaurant_id: restaurant.id,
          account_holder_name: userData.account_holder_name || "",
          account_number: userData.account_number || "",
          ifsc_code: userData.ifsc_code || "",
          bank_name: userData.bank_name || "",
        },
      });

      // If business was rejected, updating bank details should reset status to PENDING
      if (restaurant.verification_status === "REJECTED") {
        await prisma.restaurants.update({
          where: { id: restaurant.id },
          data: { verification_status: "PENDING" }
        });
      }
    }

    // Clean up updateData
    delete updateData.account_holder_name;
    delete updateData.account_number;
    delete updateData.ifsc_code;
    delete updateData.bank_name;
  }

  return await prisma.users.update({
    where: {
      id: user_id,
    },
    data: updateData,
    include: {
      addresses: {
        where: { is_active: true },
      },
    },
  });
}

async function updateRestaurant(ownerUserId, data) {
  return await prisma.restaurants.update({
    where: {
      owner_user_id: ownerUserId,
    },
    data: {
      restaurant_name: data.restaurant_name,
      address_id: data.address_id,
    },
  });
}

module.exports = { getUserProfile, updateUser, updateRestaurant };
