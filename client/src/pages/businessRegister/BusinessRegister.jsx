import React, { useRef, useState } from "react";
import "./BusinessRegister.css";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../store/api/authApi";
import MapPicker from "../../components/MapPicker/MapPicker";

// Google Maps API Key from .env
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const BusinessRegister = () => {
  const [dragging, setDragging] = React.useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // refs for each upload box
  const fssaiRef = useRef();
  const panRef = useRef();
  const gstRef = useRef();

  // states for showing file names
  const [fssaiFile, setFssaiFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [gstFile, setGstFile] = useState(null);

  // ⭐ MAIN FUNCTION (handles click, drop, change)
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

  const { data: userData, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: "",
    phone: "",
    location: "",
    ownerName: "",
    email: "",
    accountHolder: "",
    ifsc: "",
    accountNumber: "",
    bankName: "",
    fssai: null,
    pan: null,
    gst: null,
  });

  // Sync form if userData loads later
  React.useEffect(() => {
    if (userData) {
      // If restaurant already exists, they shouldn't be here to "register" again
      if (userData.restaurants && userData.restaurants.length > 0) {
        navigate("/business_profile");
        return;
      }

      setForm(prev => ({
        ...prev,
        businessName: userData.restaurants?.[0]?.restaurant_name || prev.businessName,
        phone: userData.phone_number || prev.phone,
        location: userData.restaurants?.[0]?.address?.address_line_1 || prev.location,
        ownerName: userData.first_name || prev.ownerName,
        email: userData.email || prev.email,
        accountHolder: userData.restaurants?.[0]?.restaurant_bank_details?.[0]?.account_holder_name || prev.accountHolder,
        ifsc: userData.restaurants?.[0]?.restaurant_bank_details?.[0]?.ifsc_code || prev.ifsc,
        accountNumber: userData.restaurants?.[0]?.restaurant_bank_details?.[0]?.account_number || prev.accountNumber,
        bankName: userData.restaurants?.[0]?.restaurant_bank_details?.[0]?.bank_name || prev.bankName,
      }));
    }
  }, [userData, navigate]);

  const handleLocationConfirm = (address, position) => {
    setForm((prev) => ({ ...prev, location: address }));
    setIsMapOpen(false);
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileUpload(e) {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        first_name: form.ownerName,
        email: form.email,
        phone_number: form.phone,
        restaurant_name: form.businessName,
        account_holder_name: form.accountHolder,
        account_number: form.accountNumber,
        ifsc_code: form.ifsc,
        bank_name: form.bankName,
      }).unwrap();
      navigate("/business_profile");
    } catch (err) {
      console.error("Failed to register business:", err);
      alert("Failed to register business. Please try again.");
    }
  };

  if (isProfileLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="main">
        <div className="header">
          <h3>Register Your Business</h3>
          <p>Provide your business details to get started.</p>
        </div>
        <hr className="line" />
        <form onSubmit={handleSubmit}>
          <div className="body">
            {/* Business Info */}
            <h3>Restaurant Information</h3>
            <div className="input-row">
              <div>
                <label>Restaurant name</label>
                <input
                  name="businessName"
                  placeholder="e.g., The Grand Hotel"
                  value={form.businessName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Owner name</label>
                <input
                  name="ownerName"
                  placeholder="e.g., John Doe"
                  value={form.ownerName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label>Phone number</label>
                <input
                  name="phone"
                  placeholder="+9 Indian 9875657600"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  name="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-row">
              <div>
                <h3>Location</h3>

                <span className="location-input">
                  <LocationOnIcon className="location-pin-icon" />
                  <div className="location-section">
                    <h4>Location/address on the map</h4>
                    <p className="location-text-display">
                      {form.location || "Choose location on map"}
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
              </div>
            </div>

            {/* Map Picker Modal */}
            <MapPicker
              isOpen={isMapOpen}
              onClose={() => setIsMapOpen(false)}
              onConfirm={handleLocationConfirm}
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            />

            <div className="docs-section">
              <h3>Legal Documents</h3>
              <div className="documents-upload">
                {/* ⭐ FSSAI */}
                <div
                  className="upload-box"
                  onClick={() => fssaiRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFile(e, fssaiRef, setFssaiFile)}
                >
                  <UploadFileIcon className="upload-icon" />
                  <span>Upload FSSAI license</span>

                  <input
                    ref={fssaiRef}
                    type="file"
                    accept=".pdf,.jpg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e, fssaiRef, setFssaiFile)}
                  />

                  <p>PDF, JPG, PNG up to 5MB</p>
                  {fssaiFile && (
                    <p className="selected-file">Selected: {fssaiFile.name}</p>
                  )}
                </div>

                {/* ⭐ PAN */}
                <div
                  className="upload-box"
                  onClick={() => panRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFile(e, panRef, setPanFile)}
                >
                  <UploadFileIcon className="upload-icon" />
                  <span>Upload PAN card</span>

                  <input
                    ref={panRef}
                    type="file"
                    accept=".pdf,.jpg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e, panRef, setPanFile)}
                  />

                  <p>PDF, JPG, PNG up to 5MB</p>
                  {panFile && (
                    <p className="selected-file">Selected: {panFile.name}</p>
                  )}
                </div>

                {/* ⭐ GST */}
                <div
                  className="upload-box"
                  onClick={() => gstRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFile(e, gstRef, setGstFile)}
                >
                  <UploadFileIcon className="upload-icon" />
                  <span>Upload GST (optional)</span>

                  <input
                    ref={gstRef}
                    type="file"
                    accept=".pdf,.jpg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e, gstRef, setGstFile)}
                  />

                  <p>PDF, JPG, PNG up to 5MB</p>
                  {gstFile && (
                    <p className="selected-file">Selected: {gstFile.name}</p>
                  )}
                </div>
              </div>
            </div>
            <h3>Bank Account Details</h3>

            <div className="input-row">
              <div>
                <label>Account holder name</label>
                <input
                  name="accountHolder"
                  placeholder="Enter name as per bank records"
                  value={form.accountHolder}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Account number</label>
                <input
                  name="accountNumber"
                  placeholder="Enter your bank account number"
                  value={form.accountNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label>IFSC code</label>
                <input
                  name="ifsc"
                  placeholder="Enter bank's IFSC code"
                  value={form.ifsc}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Bank name</label>
                <input
                  name="bankName"
                  placeholder="Enter bank name"
                  value={form.bankName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="bottom-buttons">
            <button className="cancel-btn">Cancel</button>
            <button className="submit-btn">Register Business </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BusinessRegister;
