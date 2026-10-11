const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();

  } catch (error) {
    console.error("Error in isAuth middleware:", error);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = isAuth;