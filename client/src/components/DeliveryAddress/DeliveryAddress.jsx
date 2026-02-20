import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryAddress.css";
import AddressModal from "../AddressModal/AddressModal";

// Mock addresses data
const MOCK_ADDRESSES = [
  {
    id: "1",
    type: "Home",
    name: "Home Address",
    street: "4517 Washington Ave.",
    city: "Manchester",
    state: "Kentucky",
    zip: "39495",
    country: "United States",
    isDefault: true,
  },
  {
    id: "2",
    type: "Work",
    name: "Office",
    street: "2464 Royal Ln. Mesa",
    city: "New Jersey",
    state: "NJ",
    zip: "45463",
    country: "United States",
    isDefault: false,
  },
  {
    id: "3",
    type: "Other",
    name: "Parent's House",
    street: "1234 Oak Street",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    country: "United States",
    isDefault: false,
  },
];

export const DeliveryAddress = ({ onProceedToPayment, externalAddresses = [], isPlacing = false }) => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(externalAddresses.length > 0 ? externalAddresses : MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Sync state if externalAddresses change
  React.useEffect(() => {
    if (externalAddresses.length > 0) {
      setAddresses(externalAddresses);
      setSelectedAddress(externalAddresses[0]);
    }
  }, [externalAddresses]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case "Home":
        return "home";
      case "Work":
        return "work";
      default:
        return "location_on";
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = (formData) => {
    if (editingAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
        )
      );
    } else {
      // Add new address
      const newAddress = {
        ...formData,
        id: Date.now().toString(),
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="delivery-address-card">
      <header className="delivery-address-header">
        <h2 className="delivery-address-title">Delivery Address</h2>
        <button
          className="delivery-change-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="material-icons-outlined">edit_location</span>
          Change
        </button>
      </header>

      <div className="delivery-address-body">
        {/* Selected Address Display */}
        <div className="selected-address-display">
          <div className="address-icon-wrapper">
            <span className="material-icons-outlined address-icon">
              {getAddressIcon(selectedAddress.type)}
            </span>
          </div>
          <div className="address-details">
            <div className="address-type-row">
              <span className="address-type-label">{selectedAddress.name}</span>
              {selectedAddress.isDefault && (
                <span className="default-badge">Default</span>
              )}
            </div>
            <p className="address-text">{selectedAddress.street}</p>
            <p className="address-text">
              {selectedAddress.city}, {selectedAddress.state}{" "}
              {selectedAddress.zip}
            </p>
            <p className="address-text">{selectedAddress.country}</p>
          </div>
        </div>

        {/* Dropdown Address List */}
        {isDropdownOpen && (
          <div className="address-dropdown">
            <div className="address-dropdown-header">
              <span className="dropdown-header-text">Select Address</span>
              <button
                className="dropdown-close-button"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>

            <div className="address-list">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  className={`address-list-item ${selectedAddress.id === address.id ? "selected" : ""
                    }`}
                  onClick={() => handleSelectAddress(address)}
                >
                  <div className="address-list-icon">
                    <span className="material-icons-outlined">
                      {getAddressIcon(address.type)}
                    </span>
                  </div>
                  <div className="address-list-content">
                    <div className="address-list-header">
                      <span className="address-list-name">{address.name}</span>
                      {address.isDefault && (
                        <span className="address-list-badge">Default</span>
                      )}
                    </div>
                    <p className="address-list-text">
                      {address.street}, {address.city}, {address.state}{" "}
                      {address.zip}
                    </p>
                  </div>
                  {selectedAddress.id === address.id && (
                    <div className="address-check-icon">
                      <span className="material-icons-outlined">
                        check_circle
                      </span>
                    </div>
                  )}
                </button>
              ))}

              {/* Add New Address Button */}
              <button
                className="add-new-address-button"
                onClick={handleAddNewAddress}
              >
                <div className="add-address-icon">
                  <span className="material-icons-outlined">
                    add_location_alt
                  </span>
                </div>
                <span className="add-address-text">Add New Address</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="delivery-address-footer">
        <button
          className="proceed-payment-button"
          onClick={onProceedToPayment}
          disabled={isPlacing}
        >
          {isPlacing ? (
            <span className="proceed-button-text">Placing Order...</span>
          ) : (
            <>
              <span className="proceed-button-text">Place Order</span>
              <span className="material-icons-outlined">arrow_forward</span>
            </>
          )}
        </button>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAddress}
        editingAddress={editingAddress}
      />
    </div>
  );
};
