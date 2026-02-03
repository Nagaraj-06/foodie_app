import React, { useRef, useState } from "react";
import "./AddMenuItem.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Icon from "@mui/material/Icon";

const AddMenuItem = () => {
  const itemRef = useRef();
  const [itemFile, setItemFile] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([]);

  const [form, setForm] = useState({
    // Item Info
    itemName: "",
    description: "",
    photo: "",
    category: "",
    food_type: "",
  });

  const [variants, setVariants] = useState([
    { id: 1, name: "Large", price: "800.00", isDefault: true },
    { id: 2, name: "Medium", price: "500.00", isDefault: false },
    { id: 3, name: "Small", price: "300.00", isDefault: false },
  ]);

  const [foodTypes, setFoodTypes] = useState([
    { id: 1, name: "Veg" },
    { id: 2, name: "Non Veg" },
  ]);

  const food_types = ["Veg", "NonVeg"];

  const categories = [
    "Starters",
    "Main Course",
    "Desserts",
    "Beverages",
    "Salads",
    "Soups",
    "Pizza",
    "Pasta",
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
    }
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);
  }

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
                  {food_types.map((food_type) => (
                    <option key={food_type} value={food_type}>
                      {food_type}
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
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
            <button className="submit-btn">Add Item </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddMenuItem;
