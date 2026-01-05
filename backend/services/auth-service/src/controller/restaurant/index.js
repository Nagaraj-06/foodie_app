const updateRestaurantSchema = require("../../routes/private/restaurant/schema");
const { updateRestaurantFull, addMenuItemWithVariants } = require("../../services/restaurant.service");

async function updateRestaurantController(req, res) {
  try {
    const body = req.body;

    const { error, value } = updateRestaurantSchema.validate(body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Restaurant photo
    if (req.files?.photo) {
      value.photo = req.files.photo[0].filename;
    }

    // Documents
    if (req.files?.documents) {
      value.documents = req.files.documents.map((file, index) => ({
        document_category_id: body.documents[index].document_category_id,
        document_url: file.filename,
        status: true,
      }));
    }

    const ownerUserId = req.user.user_id;

    const result = await updateRestaurantFull(ownerUserId, {
      ...value,
      address: body.address,
    });

    res.status(200).json({
      message: "Restaurant updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function addMenuItemController(req, res) {
  try {
    const { error, value } = updateRestaurantSchema.addMenuItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const item = await addMenuItemWithVariants(value);

    return res.status(201).json({
      message: "Menu item added successfully",
      data: item,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { updateRestaurantController, addMenuItemController };
