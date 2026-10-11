const User = require("../Models/user.model");
const generateToken = require("../Config/token");

const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        aiCredits: user.aiCredits,
      },
    });
  } catch (error) {
    console.error("Error in Google Auth:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error in Logout:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  googleAuth,
  logout,
};
