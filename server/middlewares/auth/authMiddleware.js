const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env.config");
const UserModel = require("../../models/UserModel");

const authMiddleware = async (req, res, next) => {
  // Prefer cookie auth (browser), but also allow Bearer token (e.g. if cookies are blocked).
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const bearerToken =
    typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7)
      : null;

  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Our JWT payload uses `id` (set at login). Keep backwards compatibility just in case.
    const userId = decoded?.id || decoded?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = { ...decoded, id: userId };

    // Optional: ensure user still exists (prevents auth with deleted accounts)
    const freshUser = await UserModel.findById(userId);
    if (!freshUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = { authMiddleware };
