const { prisma } = require("@foodie-app/prisma-client");

async function updateUser(user_id, data) {
  const { address, ...userData } = data;

  const updateData = {
    ...userData,
  };

  if (address) {
    // Check if an identical address already exists for this user
    const existingAddress = await prisma.addresses.findFirst({
      where: {
        user_id: user_id,
        address_type: address.address_type,
        street_address: address.street_address,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
        country_name: address.country_name,
        is_active: true,
      },
    });

    if (!existingAddress) {
      updateData.addresses = {
        create: {
          ...address,
        },
      };
    }
  }

  return await prisma.users.update({
    where: {
      id: user_id,
    },
    data: updateData,
    include: {
      addresses: true,
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

module.exports = { updateUser, updateRestaurant };
