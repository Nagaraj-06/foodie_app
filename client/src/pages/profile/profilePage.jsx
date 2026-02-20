import React, { useState, useEffect } from "react";
import "./profilePage.css";
import AddressCard from "../../components/AddressCard/AddressCard";
import AddressModal from "../../components/AddressModal/AddressModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProfileQuery, useUpdateProfileMutation, useLogoutMutation } from "../../store/api/authApi";
import { logout as logoutAction } from "../../store/slices/authSlice";

const ProfilePage = () => {
  const { data: userData, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logoutApi] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    avatar: "https://picsum.photos/seed/user123/200/200",
    status: "Active",
  });

  const [addresses, setAddresses] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (userData) {
      const isOwner = userData.role?.name === "restaurant_owner";
      const restaurant = userData.restaurants?.[0];

      const getBusinessStatus = () => {
        if (!isOwner) return null;
        if (!restaurant) return "Registration Required";
        if (restaurant.verification_status === "APPROVED") return "Verified";
        if (restaurant.verification_status === "REJECTED") return "Rejected";
        return "Pending Review";
      };

      const formattedProfile = {
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        phoneNumber: userData.phone_number || "",
        email: userData.email || "",
        avatar: userData.avatar || "https://picsum.photos/seed/user123/200/200",
        status: userData.deleted_at ? "Inactive" : "Active",
        businessStatus: getBusinessStatus(),
        isOwner
      };
      setProfile(formattedProfile);
      setAddresses(userData.addresses || []);
      setInitialData({ profile: formattedProfile, addresses: userData.addresses || [] });
    }
  }, [userData]);

  useEffect(() => {
    if (initialData) {
      const currentData = { profile, addresses };
      const hasChanged = JSON.stringify(currentData) !== JSON.stringify(initialData);
      setIsChanged(hasChanged);
    }
  }, [profile, addresses, initialData]);

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
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
        )
      );
    } else {
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

  const handleCancel = () => {
    setProfile(initialData.profile);
    setAddresses(initialData.addresses);
  };

  const handleSaveAllChanges = async () => {
    try {
      const updateData = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone_number: profile.phoneNumber,
        email: profile.email,
        avatar: profile.avatar,
        addresses: addresses.map((addr) => ({
          ...(addr.id && addr.id.length === 36 ? { id: addr.id } : {}),
          address_type: addr.address_type,
          street_address: addr.street_address,
          city: addr.city,
          state: addr.state,
          zip_code: addr.zip_code,
          country_name: addr.country_name,
          is_active: addr.is_active !== undefined ? addr.is_active : true,
        })),
      };
      await updateProfile(updateData).unwrap();
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + (err.data?.message || err.message));
    }
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

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logoutApi().unwrap();
        dispatch(logoutAction());
        navigate("/login");
      } catch (err) {
        console.error("Logout failed:", err);
        // Even if API fails, we should clear local state
        dispatch(logoutAction());
        navigate("/login");
      }
    }
  };

  if (isLoading) return <div className="loading-container">Loading...</div>;
  if (isError) return <div className="error-container">Error loading profile details.</div>;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Profile</h1>
          <p className="settings-subtitle">
            Manage your profile details and saved locations.
          </p>
        </div>
        {isChanged && (
          <div className="settings-actions">
            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            <button className="save-button" onClick={handleSaveAllChanges} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
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
                    alt={profile.firstName}
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
                  {profile.isOwner && (
                    <span className={`business-status-badge ${profile.businessStatus?.toLowerCase().replace(' ', '-')}`}>
                      Business: {profile.businessStatus}
                    </span>
                  )}
                </div>
                <p className="profile-email">{profile.email}</p>
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
                <div className="profile-logout-section">
                  <button className="logout-button-profile" onClick={handleLogout}>
                    <span className="material-symbols-outlined">logout</span>
                    Logout
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
