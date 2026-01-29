const {
  loginUser,
  sendOtpService,
  verifyOtpService,
  googleLoginService,
  refreshTokenService,
  logoutService,
} = require("../../services/auth.service");
const {
  registerRestaurantService,
} = require("../../services/restaurant.service");
const jwt = require("jsonwebtoken");

// sign In
async function signIn(req, res, next) {
  const { email, password } = req.body;

  const { user, token } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: { id: user.id, email: user.email },
    token,
  });
}

const sendOtp = async (req, res) => {
  try {
    const { phone, role_id } = req.body;

    const data = await sendOtpService(phone, role_id);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp, role_id } = req.body;

    const { user, accessToken, refreshToken } = await verifyOtpService(
      phone,
      otp,
      role_id
    );

    // set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "OTP verified successfully",
      user,
      // NOTE : send for only postmon testing, if frontend ready remove these two lines
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { email, name, role_id } = req.body;
    const { user, accessToken, refreshToken } = await googleLoginService(
      email,
      name,
      role_id
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new Error("No refresh token");

    const { user_id } = jwt.decode(token);
    const data = await refreshTokenService(user_id, token);

    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const { user_id } = req.user; // decoded by auth middleware
    await logoutService(user_id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const registerRestaurant = async (req, res) => {
  try {
    const registrationData = req.body;
    const files = req.files;

    const result = await registerRestaurantService(registrationData, files);

    res.status(201).json({
      message: "Restaurant registered successfully. You can now login.",
      data: result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  signIn,
  sendOtp,
  verifyOtp,
  googleLogin,
  refreshToken,
  logout,
  registerRestaurant,
};
