const updateRestaurantSchema = require("../../routes/private/restaurant/schema");
const { updateRestaurantFull, addMenuItemWithVariants, listCategories, getAllRestaurantsDiscovery, getRestaurantMenuDiscovery, getMenuItemDiscovery } = require("../../services/restaurant.service");

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
    const body = req.body;

    // Parse variants if they come as a JSON string (typical for FormData)
    if (typeof body.variants === 'string') {
      try {
        body.variants = JSON.parse(body.variants);
      } catch (e) {
        return res.status(400).json({ message: "Invalid variants format" });
      }
    }

    const { error, value } = updateRestaurantSchema.addMenuItemSchema.validate(body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Set photo if uploaded
    if (req.file) {
      // Multer adds 'file' for upload.single
      value.photo = req.file.path; // Store the full path for easier serving
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

async function getCategoriesController(req, res) {
  try {
    const categories = await listCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAllRestaurantsController(req, res) {
  try {
    const restaurants = await getAllRestaurantsDiscovery();
    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getRestaurantMenuController(req, res) {
  try {
    const { id } = req.params;
    const menu = await getRestaurantMenuDiscovery(id);
    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getMenuItemController(req, res) {
  try {
    const { itemId } = req.params;
    const item = await getMenuItemDiscovery(itemId);
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { updateRestaurantController, addMenuItemController, getCategoriesController, getAllRestaurantsController, getRestaurantMenuController, getMenuItemController };
