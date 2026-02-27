const express = require("express");
const {
  registerRestaurantSchema,
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
  registerRestaurant,
  getRoles,
} = require("../../../controller/auth");
const { googleLoginService } = require("../../../services/auth.service");
const validate = require("../../../middlewares/validate.middleware");
const upload = require("../../../middlewares/upload.middleware");
const router = express.Router();

/**
 * @swagger
 * /register-restaurant:
 *   post:
 *     summary: Register a new restaurant and owner
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRestaurant'
 *     responses:
 *       201:
 *         description: Restaurant registered successfully
 */
router.post(
  "/register-restaurant",
  upload.fields([
    { name: "fssai", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "gst", maxCount: 1 },
  ]),
  validate(registerRestaurantSchema),
  registerRestaurant
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignInResponse'
 *       401:
 *         description: Unauthorized
 */
router.post("/login", validate(signInSchema), signIn);

router.get("/", (req, res) => {
  res.send("Hello World! This is a GET request response.");
});

// login via mobile - otp routes
/**
 * @swagger
 * /send-otp:
 *   post:
 *     summary: Send OTP to phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post("/send-otp", validate(sendOtpSchema), sendOtp);

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

// login via google sign-in
/**
 * @swagger
 * /google-login:
 *   post:
 *     summary: Google Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/google-login", validate(googleLoginSchema), googleLogin);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Fetch active roles
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Roles fetched
 */
router.get("/roles", getRoles);

// Passport Google OAuth Routes
router.get(
  "/google",
  (req, res, next) => {
    const { role_id } = req.query;
    require("passport").authenticate("google", {
      scope: ["email", "profile"],
      state: role_id
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  require("passport").authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
  }),
  async (req, res) => {
    try {
      const { email, displayName } = req.user;
      const { state: role_id } = req.query;

      if (!role_id) {
        throw new Error("Role ID is missing from OAuth state");
      }

      const { user, accessToken, refreshToken } = await googleLoginService(
        email,
        displayName,
        role_id
      );

      // Set cookies (same as verify-otp logic)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "Lax",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // Redirect to frontend dashboard or home
      // We can also pass a flag that login was successful
      res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${accessToken}`);
    } catch (err) {
      console.error("Google Auth Error:", err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(err.message)}`);
    }
  }
);

// tokens
/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */
const authMiddleware = require("../../../middlewares/auth.middleware");

router.post("/logout", authMiddleware(), logout);

module.exports = router;
