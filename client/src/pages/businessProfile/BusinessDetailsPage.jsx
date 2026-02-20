import React, { useState, useEffect } from "react";
import "./BusinessDetailsPage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProfileQuery, useUpdateProfileMutation, useLogoutMutation } from "../../store/api/authApi";
import { logout as logoutAction } from "../../store/slices/authSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapPicker from "../../components/MapPicker/MapPicker";

const BusinessDetailsPage = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const { data: userData, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logoutApi] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    ownerName: "",
    restaurantPic: "https://picsum.photos/seed/restaurant123/200/200",
    phoneNumber: "",
    email: "",
    location: "",
    locationVerified: false,
    fssaiLicense: "",
    panCard: "",
    gstNumber: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    status: "Pending",
    bankVerified: false,
  });

  const handleLocationConfirm = (address, position) => {
    setBusinessDetails((prev) => ({ ...prev, location: address }));
    setIsMapOpen(false);
    setIsChanged(true);
  };

  const [initialData, setInitialData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isLocationEditing, setIsLocationEditing] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  const [isBankEditing, setIsBankEditing] = useState(false);

  useEffect(() => {
    if (userData) {
      console.log("User Data loaded:", userData);
      const restaurant = userData.restaurants?.[0] || {};
      const bank = restaurant.restaurant_bank_details?.[0] || {};

      const firstName = userData.first_name || "";
      const lastName = userData.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim() || userData.email?.split('@')[0] || "Business Owner";

      const getStatusLabel = (status) => {
        if (status === "APPROVED") return "Verified";
        if (status === "REJECTED") return "Rejected";
        return "Pending";
      };

      const formattedData = {
        businessName: restaurant.restaurant_name || "",
        ownerName: fullName,
        restaurantPic: restaurant.photo || "https://picsum.photos/seed/restaurant123/200/200",
        phoneNumber: userData.phone_number || "",
        email: userData.email || "",
        location: restaurant.address?.street_address || "Click to add address",
        locationVerified: restaurant.verification_status === "APPROVED",
        fssaiLicense: "",
        panCard: "",
        gstNumber: "",
        accountHolderName: bank.account_holder_name || "",
        accountNumber: bank.account_number || "",
        ifscCode: bank.ifsc_code || "",
        bankName: bank.bank_name || "",
        status: getStatusLabel(restaurant.verification_status),
        bankVerified: bank.is_verified || false,
      };
      setBusinessDetails(formattedData);
      setInitialData(formattedData);
    }
  }, [userData]);

  useEffect(() => {
    if (initialData) {
      const hasChanged = JSON.stringify(businessDetails) !== JSON.stringify(initialData);
      setIsChanged(hasChanged);
    }
  }, [businessDetails, initialData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setBusinessDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logoutApi().unwrap();
        dispatch(logoutAction());
        navigate("/login");
      } catch (err) {
        dispatch(logoutAction());
        navigate("/login");
      }
    }
  };

  const handleSaveAllChanges = async () => {
    try {
      await updateProfile({
        restaurant_name: businessDetails.businessName,
        phone_number: businessDetails.phoneNumber,
        account_holder_name: businessDetails.accountHolderName,
        account_number: businessDetails.accountNumber,
        ifsc_code: businessDetails.ifscCode,
        bank_name: businessDetails.bankName,
      }).unwrap();
      alert("Business details submitted for verification!");
      setInitialData(businessDetails);
      setIsChanged(false);
    } catch (err) {
      alert("Failed to submit: " + (err.data?.message || err.message));
    }
  };

  if (isLoading) return <div className="loading-container">Loading...</div>;
  if (isError) return <div className="error-container">Error loading profile</div>;

  return (
    <div className="business-container">
      <div className="business-header">
        <div>
          <h1 className="business-title">Business Details</h1>
          <p className="business-subtitle">
            Manage your restaurant information and legal documents.
          </p>
        </div>
        <div className="business-actions">
          <button className="business-cancel-button" onClick={() => setBusinessDetails(initialData)} disabled={!isChanged}>Cancel</button>
          <button className="business-save-button" onClick={handleSaveAllChanges} disabled={!isChanged || isUpdating}>
            {isUpdating ? "Submitting..." : (businessDetails.status === "Rejected" ? "Resubmit Registration" : "Verify")}
          </button>
        </div>
      </div>

      <div className="business-content">
        {/* Business Information Card */}
        <div className="business-info-card">
          <div className="business-card-inner">
            {/* Restaurant Picture Section */}
            <div className="restaurant-pic-section">
              <div className="restaurant-pic-wrapper">
                <div className="restaurant-pic-container">
                  <img
                    src={businessDetails.restaurantPic}
                    alt="Restaurant"
                    className="restaurant-pic-image"
                  />
                </div>
                <button className="pic-edit-button">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="business-info">
                <div className="business-name-section">
                  <h2 className="business-name">
                    {businessDetails.businessName}
                  </h2>
                  <span className={`business-status-badge ${businessDetails.status?.toLowerCase().replace(' ', '-')}`}>
                    {businessDetails.status}
                  </span>
                </div>
                <div className="business-info-meta">
                  <p className="owner-name-display">
                    Owner: {businessDetails.ownerName}
                  </p>
                  <button className="business-logout-button" onClick={handleLogout}>
                    <span className="material-symbols-outlined">logout</span>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="business-section-header">
              <h3 className="business-section-title">Basic Information</h3>
              <p className="business-section-subtitle">
                Update your business details here.
              </p>
            </div>

            <div className="business-form-grid">
              <div className="business-form-field">
                <label htmlFor="businessName" className="business-form-label">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessDetails.businessName}
                  onChange={handleInputChange}
                  className="business-form-input"
                />
              </div>
              <div className="business-form-field">
                <label htmlFor="ownerName" className="business-form-label">
                  Owner Name
                </label>
                <div className="location-input-wrapper">
                  <span className="material-symbols-outlined location-icon">
                    person
                  </span>
                  <input
                    type="text"
                    id="ownerName"
                    value={businessDetails.ownerName}
                    onChange={handleInputChange}
                    className="business-form-input phone-input"
                  />
                </div>
              </div>
              <div className="business-form-field">
                <label htmlFor="phoneNumber" className="business-form-label">
                  Phone Number
                </label>
                <div className="location-input-wrapper">
                  <span className="material-symbols-outlined location-icon">
                    phone
                  </span>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={businessDetails.phoneNumber}
                    onChange={handleInputChange}
                    className="business-form-input phone-input"
                  />
                </div>
              </div>
              <div className="business-form-field">
                <label htmlFor="email" className="business-form-label">
                  Email Address
                </label>
                <div className="location-input-wrapper">
                  <span className="material-symbols-outlined location-icon">
                    mail
                  </span>
                  <input
                    type="email"
                    id="email"
                    value={businessDetails.email}
                    onChange={handleInputChange}
                    className="business-form-input phone-input"
                  />
                </div>
              </div>
              <div className="business-form-field business-field-full">
                <label htmlFor="location" className="business-form-label">
                  Location
                  {businessDetails.locationVerified && (
                    <span className="verified-badge">Verified</span>
                  )}
                </label>
                <div>
                  <span className="location-input">
                    <LocationOnIcon className="location-pin-icon" />
                    <div className="location-section">
                      <h4>Location/address on the map</h4>
                      <p className="location-text-display">
                        {businessDetails.location || "Choose location on map"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="location-change-btn"
                      onClick={() => setIsMapOpen(true)}
                    >
                      Change
                    </button>
                  </span>
                  {/* Map Picker Modal */}
                  <MapPicker
                    isOpen={isMapOpen}
                    onClose={() => setIsMapOpen(false)}
                    onConfirm={handleLocationConfirm} passwor
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Account Details Card */}
        <div className="bank-details-card">
          <div className="bank-header">
            <div>
              <h3 className="bank-title">Bank Account Details</h3>
              <p className="bank-subtitle">
                Your registered bank account information.
              </p>
            </div>
            {businessDetails.bankVerified && (
              <span className="verified-badge-section">
                <span className="material-symbols-outlined">verified</span>
                Verified
              </span>
            )}
          </div>

          <div className="bank-grid">
            <div className="bank-form-field">
              <label className="bank-form-label">Account Holder Name</label>
              <div className="bank-input-wrapper">
                <span className="material-symbols-outlined bank-icon">
                  person
                </span>
                <input
                  type="text"
                  id="accountHolderName"
                  value={businessDetails.accountHolderName}
                  onChange={(e) => {
                    handleInputChange(e);
                    setIsBankEditing(true);
                  }}
                  readOnly={businessDetails.bankVerified && businessDetails.status !== "Rejected"}
                  className={`bank-form-input ${(businessDetails.bankVerified && businessDetails.status !== "Rejected") ? "locked-input" : ""}`}
                />
              </div>
            </div>
            <div className="bank-form-field">
              <label className="bank-form-label">Account Number</label>
              <div className="bank-input-wrapper">
                <span className="material-symbols-outlined bank-icon">
                  account_balance
                </span>
                <input
                  type="text"
                  id="accountNumber"
                  value={businessDetails.accountNumber}
                  onChange={(e) => {
                    handleInputChange(e);
                    setIsBankEditing(true);
                  }}
                  readOnly={businessDetails.bankVerified && businessDetails.status !== "Rejected"}
                  className={`bank-form-input ${(businessDetails.bankVerified && businessDetails.status !== "Rejected") ? "locked-input" : ""}`}
                />
              </div>
            </div>
            <div className="bank-form-field">
              <label className="bank-form-label">IFSC Code</label>
              <div className="bank-input-wrapper">
                <span className="material-symbols-outlined bank-icon">
                  code
                </span>
                <input
                  type="text"
                  id="ifscCode"
                  value={businessDetails.ifscCode}
                  onChange={(e) => {
                    handleInputChange(e);
                    setIsBankEditing(true);
                  }}
                  readOnly={businessDetails.bankVerified && businessDetails.status !== "Rejected"}
                  className={`bank-form-input ${(businessDetails.bankVerified && businessDetails.status !== "Rejected") ? "locked-input" : ""}`}
                />
              </div>
            </div>
            <div className="bank-form-field">
              <label className="bank-form-label">Bank Name</label>
              <div className="bank-input-wrapper">
                <span className="material-symbols-outlined bank-icon">
                  account_balance_wallet
                </span>
                <input
                  type="text"
                  id="bankName"
                  value={businessDetails.bankName}
                  onChange={(e) => {
                    handleInputChange(e);
                    setIsBankEditing(true);
                  }}
                  readOnly={businessDetails.bankVerified && businessDetails.status !== "Rejected"}
                  className={`bank-form-input ${(businessDetails.bankVerified && businessDetails.status !== "Rejected") ? "locked-input" : ""}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsPage;
