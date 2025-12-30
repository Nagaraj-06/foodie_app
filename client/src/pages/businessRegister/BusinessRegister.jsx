import React, { useRef, useState } from "react";
import "./BusinessRegister.css";
import LocationIcon from "@mui/icons-material/LocationCitySharp";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const BusinessRegister = () => {
  const [dragging, setDragging] = React.useState(false);

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
  const [form, setForm] = useState({
    // Business Info
    businessName: "",
    phone: "",
    location: "",

    // Owner Info
    ownerName: "",
    email: "",

    // Bank Details
    accountHolder: "",
    ifsc: "",
    accountNumber: "",
    bankName: "",

    // File Uploads
    fssai: null,
    pan: null,
    gst: null,
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileUpload(e) {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);
  }

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
                {/* <label>Business name</label> */}
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
                  placeholder="+91 9875657600"
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

                <span
                  className="location-input"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                >
                  <LocationIcon />
                  <div className="location-section">
                    <h4>Location/address on the map</h4>
                    <p>123 Market St, San Francisco, CA</p>
                  </div>
                  <button className="location-change-btn">Change</button>
                </span>
              </div>
            </div>
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
