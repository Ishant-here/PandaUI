const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../Models/user.model");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────────────────────
// Step 1: Create an order
// ─────────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // in rupees

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ message: "Failed to create order" });
  }
};

// ─────────────────────────────────────────────────────────────
// Step 2: Verify payment + update user
// ─────────────────────────────────────────────────────────────
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment fields",
      });
    }

    // Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user plan + credits
    user.aiCredits += 200;
    user.plan = "pro";
    user.totalCreditsPurchased = (user.totalCreditsPurchased || 0) + 200;
    user.lastPaymentId = razorpay_payment_id;
    user.lastPaymentAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified. Pro plan activated.",
      remainingCredits: user.aiCredits,
      plan: user.plan,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        aiCredits: user.aiCredits,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

module.exports = { createOrder, verifyPayment };