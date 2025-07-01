require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER: ", authHeader);

    if (!authHeader) {
      return res.status(403).json({ error: "No authorization header" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decodedToken: ", decodedToken);
    } catch (err) {
      console.log("JWT verification failed:", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }

    if (!decodedToken || !decodedToken.userId) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Attach userId to request for later use
    req.auth = { userId: decodedToken.userId };

    // Prevent userId spoofing in body (for JSON requests)
    if (
      req.body &&
      req.body.userId &&
      req.body.userId !== decodedToken.userId
    ) {
      // Log body for debugging
      console.log("req.body: ", req.body);
      console.log("req.body.userId: ", req.body.userId);
      return res.status(403).json({ error: "User ID mismatch" });
    }
    console.log("decodedToken.userId: ", decodedToken.userId);

    next();
  } catch (error) {
    console.log("Auth error:", error);
    res.status(403).json({ error: "Unauthorized request" });
  }
};
