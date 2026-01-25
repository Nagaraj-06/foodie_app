const { prisma } = require("@foodie-app/prisma-client");

async function updateUser(user_id, data) {
  const { address, ...userData } = data;

  const updateData = {
    ...userData,
  };

  if (address) {
    updateData.addresses = {
      create: {
        ...address,
      },
    };
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

async function createUserAddress(user_id, addressData) {
  return await prisma.addresses.create({
    data: {
      user_id,
      ...addressData,
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

module.exports = { updateUser, createUserAddress, updateRestaurant };
