import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSendOtpMutation, useVerifyOtpMutation, useGetRolesQuery, useGetProfileQuery } from "../../store/api/authApi";
import { setCredentials } from "../../store/slices/authSlice";
import { API_BASE_URL } from "../../config";

export const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery();
  const [sendOtp, { isLoading: isSendingOtp, error: sendOtpError }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp, error: verifyOtpError }] = useVerifyOtpMutation();

  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const UserType = {
    CUSTOMER: "Customer",
    BUSINESS_OWNER: "Business Owner",
  };
  const [userType, setUserType] = useState(UserType.CUSTOMER);

  // Map UserType to role names in DB
  const roleNameMap = {
    [UserType.CUSTOMER]: "customer",
    [UserType.BUSINESS_OWNER]: "restaurant_owner",
  };


  const getRoleId = () => {
    const roleName = roleNameMap[userType];
    const role = roles.find(r => r.name === roleName);
    return role ? role.id : null;
  };

  const { data: userData } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    if (isAuthenticated && userData) {
      const userRole = userData.role?.name;
      const hasRestaurant = userData.restaurants?.length > 0 && userData.restaurants[0].restaurant_name;

      if (userRole === "restaurant_owner") {
        if (!hasRestaurant) {
          navigate("/business_register");
        } else {
          navigate("/business_profile");
        }
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, userData, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const role_id = getRoleId();
    if (!role_id) {
      alert("Role information not loaded yet. Please wait a moment.");
      return;
    }
    try {
      await sendOtp({ phone, role_id }).unwrap();
      setOtpSent(true);
    } catch (err) {
      console.error("Failed to send OTP:", err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const role_id = getRoleId();
    try {
      const result = await verifyOtp({ phone, otp, role_id }).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.accessToken }));
    } catch (err) {
      console.error("Failed to verify OTP:", err);
    }
  };

  const handleGoogleSignIn = () => {
    const role_id = getRoleId();
    if (!role_id) {
      alert("Role information not loaded yet. Please wait a moment.");
      return;
    }
    const baseUrl = API_BASE_URL;
    window.location.href = `${baseUrl}/auth/public/api/auth/google?role_id=${role_id}`;
  };

  const error = sendOtpError?.data?.message || verifyOtpError?.data?.message;

  if (isLoadingRoles) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div className="login-spinner" />
          <p>Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>

        <div className="login-user-type-toggle">
          <button
            onClick={() => setUserType(UserType.CUSTOMER)}
            className={`login-user-type-button ${userType === UserType.CUSTOMER ? "active" : ""}`}
          >
            Customer
          </button>
          <button
            onClick={() => setUserType(UserType.BUSINESS_OWNER)}
            className={`login-user-type-button ${userType === UserType.BUSINESS_OWNER ? "active" : ""}`}
          >
            Business Owner
          </button>
          <div className={`login-toggle-indicator ${userType === UserType.BUSINESS_OWNER ? "right" : ""}`} />
        </div>

        {error && <div className="login-error-message">{error}</div>}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="login-form">
            <div className="login-form-group">
              <label className="login-form-label">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="login-form-input"
                required
                maxLength={10}
              />
            </div>
            <button type="submit" disabled={isSendingOtp} className="login-submit-button">
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <div className="login-form-group">
              <label className="login-form-label">Verify OTP</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="login-form-input"
                required
                maxLength={6}
              />
              <p className="login-otp-info">OTP sent to {phone}</p>
            </div>
            <button type="submit" disabled={isVerifyingOtp} className="login-submit-button">
              {isVerifyingOtp ? "Verifying..." : "Verify & Login"}
            </button>
            <button type="button" className="login-resend-button" onClick={() => setOtpSent(false)}>
              Cancel
            </button>
          </form>
        )}

        <div className="login-divider-wrapper">
          <div className="login-divider-line"></div>
          <span className="login-divider-text">or</span>
        </div>

        <button onClick={handleGoogleSignIn} className="login-google-button" disabled={isSendingOtp || isVerifyingOtp}>
          <svg className="login-google-icon" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.94l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span className="login-google-text">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

