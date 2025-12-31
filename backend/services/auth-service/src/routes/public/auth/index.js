const express = require("express");
const { signInSchema, sendOtpSchema, verifyOtpSchema } = require("./schema");
const { signIn, sendOtp, verifyOtp } = require("../../../controller/auth");
const validate = require("../../../middlewares/validate.middleware");
const router = express.Router();

router.post("/login", validate(signInSchema), signIn);

router.get("/", (req, res) => {
  res.send("Hello World! This is a GET request response.");
});

// otp routes
router.post("/send-otp", validate(sendOtpSchema), sendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

module.exports = router;
