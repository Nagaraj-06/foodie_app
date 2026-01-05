const { prisma } = require("@foodie-app/prisma-client");

async function updateUser(user_id, data) {
  return await prisma.users.update({
    where: {
      id: user_id,
    },
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      email: data.email,
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
