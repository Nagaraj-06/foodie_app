import React, { useState, useEffect } from "react";
import "./AddressModal.css";

const AddressModal = ({ isOpen, onClose, onSave, editingAddress }) => {
  const [formData, setFormData] = useState({
    type: "Home",
    addressLine1: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    isDefault: false,
  });

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    } else {
      setFormData({
        type: "Home",
        addressLine1: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
        isDefault: false,
      });
    }
  }, [editingAddress, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (
      formData.addressLine1 &&
      formData.city &&
      formData.state &&
      formData.zip
    ) {
      onSave(formData);
    } else {
      alert("Please fill in all required fields");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="form-field">
            <label htmlFor="type" className="form-label">
              Address Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="addressLine1" className="form-label">
              Street Address
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter street address"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter city"
              />
            </div>

            <div className="form-field">
              <label htmlFor="state" className="form-label">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="zip" className="form-label">
                ZIP Code
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter ZIP code"
              />
            </div>

            <div className="form-field">
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="form-field-checkbox">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="isDefault" className="form-label-checkbox">
              Set as default address
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSubmit}>
            {editingAddress ? "Update Address" : "Add Address"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
