import React, { useState } from "react";
import "./BusinessDetailsPage.css";

const BusinessDetailsPage = () => {
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "Spicy House Restaurant",
    ownerName: "Rajesh Kumar",
    restaurantPic: "https://picsum.photos/seed/restaurant123/200/200",
    phoneNumber: "+91 9876543210",
    email: "spicyhouse@example.com",
    location: "123 MG Road, Bangalore, Karnataka 560001",
    locationVerified: true,
    fssaiLicense: "12345678901234",
    panCard: "ABCDE1234F",
    gstNumber: "29ABCDE1234F1Z5",
    accountHolderName: "Rajesh Kumar",
    accountNumber: "1234567890123456",
    ifscCode: "HDFC0001234",
    bankName: "HDFC Bank",
    status: "Verified",
  });

  const [isLocationEditing, setIsLocationEditing] = useState(false);
  const [tempLocation, setTempLocation] = useState(businessDetails.location);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setBusinessDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleChangeRestaurantPic = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBusinessDetails((prev) => ({
          ...prev,
          restaurantPic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveRestaurantPic = () => {
    if (
      window.confirm("Are you sure you want to remove the restaurant picture?")
    ) {
      setBusinessDetails((prev) => ({ ...prev, restaurantPic: "" }));
    }
  };

  const handleVerifyLocation = () => {
    // Simulate location verification
    setBusinessDetails((prev) => ({
      ...prev,
      location: tempLocation,
      locationVerified: true,
    }));
    setIsLocationEditing(false);
    alert("Location verified successfully!");
  };

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
          <button className="business-cancel-button">Cancel</button>
          <button className="business-save-button">Save Changes</button>
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
                  <span className="business-status-badge">
                    {businessDetails.status}
                  </span>
                </div>
                <p className="owner-name-display">
                  Owner: {businessDetails.ownerName}
                </p>
                <input
                  type="file"
                  id="restaurantPicInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleChangeRestaurantPic}
                />
                <div className="pic-actions">
                  <button
                    className="change-pic-button"
                    onClick={() =>
                      document.getElementById("restaurantPicInput").click()
                    }
                  >
                    Change Picture
                  </button>
                  <span className="pic-separator">|</span>
                  <button
                    className="remove-pic-button"
                    onClick={handleRemoveRestaurantPic}
                  >
                    Remove
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
                <input
                  type="text"
                  id="ownerName"
                  value={businessDetails.ownerName}
                  onChange={handleInputChange}
                  className="business-form-input"
                />
              </div>
              <div className="business-form-field">
                <label htmlFor="phoneNumber" className="business-form-label">
                  Phone Number
                  <span className="locked-badge">Locked</span>
                </label>
                <div className="locked-input-wrapper">
                  <span className="material-symbols-outlined locked-icon">
                    lock
                  </span>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={businessDetails.phoneNumber}
                    readOnly
                    className="business-form-input locked-input"
                  />
                </div>
              </div>
              <div className="business-form-field">
                <label htmlFor="email" className="business-form-label">
                  Email Address
                  <span className="locked-badge">Locked</span>
                </label>
                <div className="locked-input-wrapper">
                  <span className="material-symbols-outlined locked-icon">
                    lock
                  </span>
                  <input
                    type="email"
                    id="email"
                    value={businessDetails.email}
                    readOnly
                    className="business-form-input locked-input"
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
                <div className="location-input-wrapper">
                  <span className="material-symbols-outlined location-icon">
                    location_on
                  </span>
                  <input
                    type="text"
                    id="location"
                    value={
                      isLocationEditing
                        ? tempLocation
                        : businessDetails.location
                    }
                    onChange={(e) => {
                      setTempLocation(e.target.value);
                      setIsLocationEditing(true);
                    }}
                    className="business-form-input location-input"
                  />
                  {isLocationEditing && (
                    <button
                      className="verify-button"
                      onClick={handleVerifyLocation}
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Documents Card */}
        {/* <div className="legal-documents-card">
          <div className="documents-header">
            <div>
              <h3 className="documents-title">Legal Documents</h3>
              <p className="documents-subtitle">
                Your registered business documents.
              </p>
            </div>
            <span className="locked-section-badge">
              <span className="material-symbols-outlined">lock</span>
              Read Only
            </span>
          </div>

          <div className="documents-grid">
            <div className="document-item">
              <div className="document-icon-wrapper">
                <span className="material-symbols-outlined document-icon">
                  description
                </span>
              </div>
              <div className="document-details">
                <label className="document-label">FSSAI License</label>
                <input
                  type="text"
                  value={businessDetails.fssaiLicense}
                  readOnly
                  className="document-input"
                />
              </div>
            </div>
            <div className="document-item">
              <div className="document-icon-wrapper">
                <span className="material-symbols-outlined document-icon">
                  badge
                </span>
              </div>
              <div className="document-details">
                <label className="document-label">PAN Card</label>
                <input
                  type="text"
                  value={businessDetails.panCard}
                  readOnly
                  className="document-input"
                />
              </div>
            </div>
            <div className="document-item">
              <div className="document-icon-wrapper">
                <span className="material-symbols-outlined document-icon">
                  receipt_long
                </span>
              </div>
              <div className="document-details">
                <label className="document-label">GST Number</label>
                <input
                  type="text"
                  value={businessDetails.gstNumber}
                  readOnly
                  className="document-input"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* Bank Account Details Card */}
        <div className="bank-details-card">
          <div className="bank-header">
            <div>
              <h3 className="bank-title">Bank Account Details</h3>
              <p className="bank-subtitle">
                Your registered bank account information.
              </p>
            </div>
            <span className="locked-section-badge">
              <span className="material-symbols-outlined">lock</span>
              Read Only
            </span>
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
                  value={businessDetails.accountHolderName}
                  readOnly
                  className="bank-form-input"
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
                  value={businessDetails.accountNumber}
                  readOnly
                  className="bank-form-input"
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
                  value={businessDetails.ifscCode}
                  readOnly
                  className="bank-form-input"
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
                  value={businessDetails.bankName}
                  readOnly
                  className="bank-form-input"
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
