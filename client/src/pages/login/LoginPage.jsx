import { useParams } from "react-router-dom";
import "./LoginPage.css";
import { useState } from "react";
import "react-phone-input-2/lib/style.css";

export const LoginScreen = ({ onLogin }) => {
  // ============ USER TYPE ENUM ============
  const UserType = {
    CUSTOMER: "Customer",
    BUSINESS_OWNER: "Business Owner",
  };

  const [userType, setUserType] = useState(UserType.CUSTOMER);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 8) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(userType);
    }, 1500);
  };

  return (
    <div className="login-container">
      {/* Login Card */}
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>

        {/* User Type Toggle */}
        <div className="login-user-type-toggle">
          <button
            onClick={() => setUserType(UserType.CUSTOMER)}
            className={`login-user-type-button ${
              userType === UserType.CUSTOMER ? "active" : ""
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setUserType(UserType.BUSINESS_OWNER)}
            className={`login-user-type-button ${
              userType === UserType.BUSINESS_OWNER ? "active" : ""
            }`}
          >
            Business Owner
          </button>

          {/* Sliding Indicator */}
          <div
            className={`login-toggle-indicator ${
              userType === UserType.BUSINESS_OWNER ? "right" : ""
            }`}
          />
        </div>

        <form onSubmit={handleSendOTP} className="login-form">
          <div className="login-form-group">
            <label className="login-form-label">Phone Number</label>
            <input
              type="tel"
              country={"in"}
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="login-form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-submit-button"
          >
            {isLoading ? (
              <>
                <div className="login-spinner" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="login-divider-wrapper">
          <div className="login-divider-line"></div>
          <span className="login-divider-text">or</span>
        </div>

        {/* Google Auth Button */}
        <button
          onClick={() => onLogin(userType)}
          className="login-google-button"
        >
          <svg className="login-google-icon" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.94l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          <span className="login-google-text">Sign in with Google</span>
        </button>

        {/* <div className="login-footer-links">
          <a href="#" className="login-forgot-link">
            Forgot Password?
          </a>
          <p className="login-signup-text">
            New user?{" "}
            <a href="#" className="login-signup-link">
              Sign Up
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};
