const jwt = require("jsonwebtoken");

// ✅ Hardcoded — matches isAuth.middleware.js
const JWT_SECRET = "nefjnaf8u3983u94ndjfd";

const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

module.exports = generateToken;
