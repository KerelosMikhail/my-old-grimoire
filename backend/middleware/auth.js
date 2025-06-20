require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    req.auth = { userId };
    // Check if the userId in the request body matches the userId in the token
    if (!userId) {
      throw "User ID not found in token";
    }
    if (!decodedToken) {
      throw "Invalid token";
    }
    if (!token) {
      throw "No token provided";
    }

    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID mismatch";
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ error: "Unauthorized request" });
  }
};
