const jwt = require("jsonwebtoken");

// ✅ Must be the EXACT SAME string as Config/token.js
const JWT_SECRET = "nefjnaf8u3983u94ndjfd";

const isAuth = async (req, res, next) => {
  const token = req.cookies.token;

  console.log("🍪 isAuth: cookies received =", req.cookies);

  if (!token) {
    console.log("❌ isAuth: no token found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ isAuth: token verified for user", decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("❌ isAuth: verification failed:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuth;
