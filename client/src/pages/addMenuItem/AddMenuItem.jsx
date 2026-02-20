import React, { useRef, useState } from "react";
import "./AddMenuItem.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useGetProfileQuery } from "../../store/api/authApi";
import { useGetCategoriesQuery, useAddMenuItemMutation } from "../../store/api/restaurantApi";

const AddMenuItem = () => {
  const { data: userData, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const [addMenuItem, { isLoading: isSubmitting }] = useAddMenuItemMutation();

  const itemRef = useRef();
  const [itemFile, setItemFile] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([1]); // Default select first variant
  const [form, setForm] = useState({
    itemName: "",
    description: "",
    photo: "",
    category: "",
    food_type: "",
  });

  const [variants, setVariants] = useState([
    { id: 1, name: "Regular", price: "", isDefault: true },
  ]);

  if (isProfileLoading || isCategoriesLoading) return <div className="main">Loading...</div>;

  const restaurant = userData?.restaurants?.[0];
  const isApproved = restaurant?.verification_status === "APPROVED";

  if (!isApproved) {
    return (
      <div className="main">
        <div className="verification-notice">
          <span className="material-symbols-outlined notice-icon">lock_person</span>
          <h2>Access Restricted</h2>
          <p>You need to be an <strong>approved business owner</strong> to add menu items. Please ensure your business registration is complete and approved by the admin.</p>
          <button className="goto-profile-btn" onClick={() => window.location.href = '/business_profile'}>
            Check Registration Status
          </button>
        </div>
      </div>
    );
  }

  const food_types = [
    { label: "Veg", value: "VEG" },
    { label: "Non Veg", value: "NON_VEG" }
  ];

  const addVariant = () => {
    const newId = Math.max(...variants.map((v) => v.id), 0) + 1;
    setVariants([
      ...variants,
      { id: newId, name: "", price: "", isDefault: false },
    ]);
  };

  const removeVariant = (id) => {
    if (variants.length > 1) {
      setVariants(variants.filter((v) => v.id !== id));
      setSelectedVariants(prev => prev.filter(vId => vId !== id));
    }
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedVariants.length) {
        alert("Please select at least one variant");
        return;
      }

      const activeVariants = variants
        .filter(v => selectedVariants.includes(v.id))
        .map(v => ({
          name: v.name,
          price: parseFloat(v.price)
        }));

      if (activeVariants.some(v => !v.name || isNaN(v.price))) {
        alert("Please fill in all selected variant details with valid prices");
        return;
      }

      const formData = new FormData();
      formData.append("restaurant_id", restaurant.id);
      formData.append("category_id", form.category);
      formData.append("name", form.itemName);
      formData.append("food_type", form.food_type);
      formData.append("description", form.description);
      formData.append("variants", JSON.stringify(activeVariants));

      if (itemFile) {
        formData.append("photo", itemFile);
      }

      await addMenuItem(formData).unwrap();

      alert("Menu item added successfully!");
      // Reset form
      setForm({ itemName: "", description: "", photo: "", category: "", food_type: "" });
      setVariants([{ id: 1, name: "Regular", price: "", isDefault: true }]);
      setSelectedVariants([1]);
      setItemFile(null);

    } catch (err) {
      console.error(err);
      alert(err.data?.message || "Failed to add menu item");
    }
  };

  const handleVariantToggle = (id) => {
    setSelectedVariants((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleDefaultChange = (id) => {
    setVariants(variants.map((v) => ({ ...v, isDefault: v.id === id })));
  };

  const handleFile = (e, ref, setter) => {
    let file;

    // if dropped
    if (e.dataTransfer) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    }
    // if selected from file picker
    else {
      file = e.target.files[0];
    }

    if (file) {
      // set file to input
      const dt = new DataTransfer();
      dt.items.add(file);
      ref.current.files = dt.files;

      // update state for showing file name
      setter(file);
    }
  };

  return (
    <>
      <div className="main">
        <div className="header">
          <h3>Add New Menu Item</h3>
          <p>Fill in the details below to add a new item to the menu.</p>
        </div>
        <hr className="line" />
        <form onSubmit={handleSubmit}>
          <div className="body">
            <div className="input-row">
              <div>
                <label>Item Name</label>
                <input
                  name="itemName"
                  placeholder="e.g., Chicken Biryani"
                  value={form.itemName}
                  onChange={handleChange}
                  className="add-menu-input"
                />
              </div>

              <div className="add-menu-field">
                <label className="add-menu-label">Food Type</label>
                <select
                  name="food_type"
                  value={form.food_type}
                  onChange={handleChange}
                  className="add-menu-select"
                >
                  <option value="">Select Food Type</option>
                  {food_types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-menu-field">
                <label className="add-menu-label">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="add-menu-select"
                >
                  <option value="">Select Category</option>
                  {categoriesData?.data?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="input-row"></div>
            <div className="input-row">
              <div>
                <label>Description</label>
                <input
                  id="item-desc"
                  name="description"
                  placeholder="Describe the item..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            <h3>Photo</h3>
            <br />
            <div className="documents-upload">
              {/* Item photo } */}
              <div
                id="item-image-upload"
                className="upload-box"
                onClick={() => itemRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleFile(e, itemRef, setItemFile)}
              >
                <UploadFileIcon className="upload-icon" />
                <span>Upload a image or drag and drop</span>

                <input
                  ref={itemRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e, itemRef, setItemFile)}
                />

                <p> JPG, PNG, JPEG up to 5MB</p>
                {itemFile && (
                  <p className="selected-file">Selected: {itemFile.name}</p>
                )}
              </div>
            </div>
            <br />

            <div className="add-menu-variants-section">
              <div className="add-menu-variants-header">
                <h3 className="add-menu-section-title">Size Variants</h3>
                <button
                  type="button"
                  className="add-variant-button"
                  onClick={addVariant}
                >
                  <span className="material-symbols-outlined">add</span>
                  Add Variant
                </button>
              </div>

              <div className="add-menu-variants-list">
                {variants.map((variant) => (
                  <div key={variant.id} className="variant-item">
                    <div className="variant-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedVariants.includes(variant.id)}
                        onChange={() => handleVariantToggle(variant.id)}
                        className="variant-checkbox-input"
                      />
                    </div>
                    <div className="variant-inputs">
                      <input
                        type="text"
                        placeholder="Size name (e.g., Large)"
                        value={variant.name}
                        onChange={(e) =>
                          handleVariantChange(
                            variant.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="variant-name-input"
                      />
                      <div className="variant-price-wrapper">
                        <span className="variant-currency">Rs.</span>
                        <input
                          type="text"
                          placeholder="0.00"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "price",
                              e.target.value
                            )
                          }
                          className="variant-price-input"
                        />
                      </div>
                    </div>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="variant-remove-button"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="variant-hint">
                Select one variant as default by clicking the radio button
              </p>
            </div>
          </div>
          <div className="bottom-buttons">
            <button className="cancel-btn">Cancel</button>
            <button className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddMenuItem;
