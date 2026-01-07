const { JWT_SECRET } = require("../config/env");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware =
  (roles = []) =>
  (req, res, next) => {
    try {
      // 1. get token from Authorization header
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      // 2. fallback to cookie or body
      const token = bearerToken || req.cookies?.accessToken;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 3. verify token
      const payload = jwt.verify(token, JWT_SECRET);

      // 4. role check (if provided)
      if (roles.length && !roles.includes(payload.role_id)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };

module.exports = authMiddleware;
