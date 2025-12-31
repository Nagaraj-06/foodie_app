const {
  loginUser,
  sendOtpService,
  verifyOtpService,
  googleLoginService,
} = require("../../services/auth.service");

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
    const { phone } = req.body;

    await sendOtpService(phone);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    await verifyOtpService(phone, otp);

    res.json({
      message: "OTP verified successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { email, name } = req.body;
    const data = await googleLoginService(email, name);
    res.json({ message: "Google login successful", ...data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { signIn, sendOtp, verifyOtp, googleLogin };
