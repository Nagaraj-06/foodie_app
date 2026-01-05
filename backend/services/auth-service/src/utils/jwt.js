const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  REFRESH_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} = require("../config/env");

// generic token generator
function generateToken(payload, expiresIn, secret) {
  return jwt.sign(payload, secret, { expiresIn });
}

// generic token verifier
function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

// helper for access token (expiry from DB/config)
function generateAccessToken(user) {
  return generateToken(
    { user_id: user.id, role_id: user.role_id },
    JWT_EXPIRES_IN, // from DB/config
    JWT_SECRET
  );
}

// helper for refresh token (expiry from DB/config)
function generateRefreshToken(user) {
  return generateToken(
    { user_id: user.id, role_id: user.role_id },
    REFRESH_EXPIRES_IN, // from DB/config
    REFRESH_SECRET
  );
}

module.exports = {
  generateToken,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
};
