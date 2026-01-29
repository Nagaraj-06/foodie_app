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

module.exports = {
  registerRestaurantService,
};
