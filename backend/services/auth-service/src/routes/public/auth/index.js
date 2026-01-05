const express = require("express");
const {
  signInSchema,
  sendOtpSchema,
  verifyOtpSchema,
  googleLoginSchema,
} = require("./schema");
const {
  signIn,
  sendOtp,
  verifyOtp,
  logout,
  googleLogin,
  refreshToken,
} = require("../../../controller/auth");
const validate = require("../../../middlewares/validate.middleware");
const router = express.Router();

router.post("/login", validate(signInSchema), signIn);

router.get("/", (req, res) => {
  res.send("Hello World! This is a GET request response.");
});

// login via mobile - otp routes
router.post("/send-otp", validate(sendOtpSchema), sendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

// login via google sign-in
router.post("/google-login", validate(googleLoginSchema), googleLogin);

// tokens
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
