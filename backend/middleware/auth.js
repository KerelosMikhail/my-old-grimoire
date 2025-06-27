require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({ error: "No authorization header" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken || !decodedToken.userId) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Attach userId to request for later use
    req.auth = { userId: decodedToken.userId };

    // Optional: Prevent userId spoofing in body (for JSON requests)
    if (req.body.userId && req.body.userId !== decodedToken.userId) {
      return res.status(403).json({ error: "User ID mismatch" });
    }

    next();
  } catch (error) {
    res.status(403).json({ error: "Unauthorized request" });
  }
};
