const User = require("../Models/user.model");

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Current user fetched successfully",
      user,
    });

  } catch (error) {
    console.error("Error in getCurrentUser:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-__v");

    if (!users || users.length === 0) {
      return res.status(200).json({
        message: "No users found",
        users: [],
      });
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });

  } catch (error) {
    console.error("Error in getAllUsers:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getCurrentUser,
  getAllUsers,
};