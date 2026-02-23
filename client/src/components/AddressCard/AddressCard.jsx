import React from "react";
import "./AddressCard.css";

const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <div className="address-card">
      <div className="address-card-header">
        <div className="address-type-badge">{address.address_type}</div>
        {address.is_active && (
          <span className="address-default-badge">Active</span>
        )}
      </div>

      <div className="address-details">
        <p className="address-line-main">{address.street_address}</p>
        <p className="address-line-secondary">
          {address.city}, {address.state} {address.zip_code}
        </p>
        <p className="address-line-secondary">{address.country_name}</p>
      </div>

      <div className="address-card-actions">
        <button
          className="address-action-btn edit-btn"
          onClick={() => onEdit(address)}
        >
          <span className="material-symbols-outlined">edit</span>
          Edit
        </button>
        <button
          className="address-action-btn delete-btn"
          onClick={() => onDelete(address.id)}
        >
          <span className="material-symbols-outlined">Delete</span>
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
