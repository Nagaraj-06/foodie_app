import React, { useState, useEffect } from "react";
import "./AddressModal.css";

const AddressModal = ({ isOpen, onClose, onSave, editingAddress }) => {
  const [formData, setFormData] = useState({
    address_type: "Home",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    country_name: "United States",
    is_active: true,
  });

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    } else {
      setFormData({
        address_type: "Home",
        street_address: "",
        city: "",
        state: "",
        zip_code: "",
        country_name: "United States",
        is_active: true,
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
      formData.street_address &&
      formData.city &&
      formData.state &&
      formData.zip_code
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
              id="address_type"
              name="address_type"
              value={formData.address_type}
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
              id="street_address"
              name="street_address"
              value={formData.street_address}
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
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
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
                id="country_name"
                name="country_name"
                value={formData.country_name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="form-field-checkbox">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="is_active" className="form-label-checkbox">
              Active Address
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
