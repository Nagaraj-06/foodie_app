import React, { useState } from "react";
import "./profilePage.css";
import AddressCard from "../../components/AddressCard/AddressCard";
import AddressModal from "../../components/AddressModal/AddressModal";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: "Sophia",
    lastName: "Davis",
    phoneNumber: "+91 770999999",
    email: "sophia.davis@example.com",
    avatar: "https://picsum.photos/seed/user123/200/200",
    status: "Active",
  });

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      type: "Home",
      isDefault: true,
      addressLine1: "4517 Washington Ave.",
      city: "Manchester",
      state: "Kentucky",
      zip: "39495",
      country: "United States",
    },
    {
      id: "2",
      type: "Work",
      isDefault: false,
      addressLine1: "2464 Royal Ln. Mesa",
      city: "New Jersey",
      state: "NJ",
      zip: "45463",
      country: "United States",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    }
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    if (window.confirm("Are you sure you want to remove the avatar?")) {
      setProfile((prev) => ({ ...prev, avatar: "" }));
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Profile</h1>
          <p className="settings-subtitle">
            Manage your profile details and saved locations.
          </p>
        </div>
        <div className="settings-actions">
          <button className="cancel-button">Cancel</button>
          <button className="save-button">Save Changes</button>
        </div>
      </div>

      <div className="settings-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-card-inner">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <div className="avatar-container">
                  <img
                    src={profile.avatar}
                    alt="Sophia Davis"
                    className="avatar-image"
                  />
                </div>
                <button className="avatar-edit-button">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="profile-info">
                <div className="profile-name-section">
                  <h2 className="profile-name">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <span className="account-status-badge">
                    {profile.status} Account
                  </span>
                </div>
                <p className="profile-email">{profile.email}</p>
                {/* Hidden file input */}
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleChangeAvatar}
                />
                <div className="avatar-actions">
                  <button
                    className="change-avatar-button"
                    onClick={() =>
                      document.getElementById("avatarInput").click()
                    }
                  >
                    Change Avatar
                  </button>
                  <span className="avatar-separator">|</span>
                  <button
                    className="remove-avatar-button"
                    onClick={handleRemoveAvatar}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="form-section-header">
              <h3 className="form-title">Essential Information</h3>
              <p className="form-subtitle">
                Update your personal details here.
              </p>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <div className="email-input-wrapper">
                  <span className="material-symbols-outlined email-icon">
                    phone
                  </span>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleInputChange}
                    className="form-input email-input"
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="email-input-wrapper">
                  <span className="material-symbols-outlined email-icon">
                    mail
                  </span>
                  <input
                    type="email"
                    id="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="form-input email-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Locations Section */}
        <div className="locations-card">
          <div className="locations-header">
            <div>
              <h3 className="locations-title">Saved Locations</h3>
              <p className="locations-subtitle">
                Manage your home and work addresses.
              </p>
            </div>
            <button
              className="add-location-button"
              onClick={handleAddNewAddress}
            >
              <span className="material-symbols-outlined">add</span>
              Add New
            </button>
          </div>

          <div className="locations-grid">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
              />
            ))}

            {/* Add New Placeholder Card */}
            <button className="add-address-card" onClick={handleAddNewAddress}>
              <div className="add-address-icon">
                <span className="material-symbols-outlined">add_location</span>
              </div>
              <span className="add-address-text">Add New Address</span>
            </button>
          </div>
        </div>
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

export default ProfilePage;
