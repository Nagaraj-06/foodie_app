import React from "react";
import "./AddressCard.css";

const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <div className="address-card">
      <div className="address-card-header">
        <div className="address-type-badge">{address.type}</div>
        {address.isDefault && (
          <span className="address-default-badge">Default</span>
        )}
      </div>

      <div className="address-details">
        <p className="address-line-main">{address.addressLine1}</p>
        <p className="address-line-secondary">
          {address.city}, {address.state} {address.zip}
        </p>
        <p className="address-line-secondary">{address.country}</p>
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
          <span className="material-symbols-outlined">delete</span>
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
