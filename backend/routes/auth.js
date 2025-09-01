const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect, adminOnly } = require("../authMiddleware");
const sendEmail = require("../sendEmail");
const validator = require("validator");
const rateLimit = require("express-rate-limit");

// ✅ Rate limiter to protect the /request-code route
const requestCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: "Too many requests. Please try again later." },
});

// ✅ Request Code (email verification)
router.post("/request-code", requestCodeLimiter, async (req, res) => {
  const { email } = req.body;

  // Basic email validation
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "A valid email is required." });
  }

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, username: email.split("@")[0] });
    }

    user.verificationCode = code;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    await sendEmail({
      to: email,
      subject: "Your Verification Code",
      text: `Hi ${user.username},\n\nYour login code is: ${code}\nThis code expires in 10 minutes.\n\n- The Team`,
    });

    // ✅ Generic response (don’t reveal if email exists for privacy)
    return res.status(200).json({
      message:
        "If this email is registered, a verification code has been sent.",
    });
  } catch (err) {
    console.error("Error in /request-code:", err);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

module.exports = router;

// verfiy code

router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.verificationCode !== code ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code." });
    }

    // Clear the verification code
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Define cookie options
// Define cookie options
const cookieOptions = {
  httpOnly: true,
  sameSite: "None", // ✅ allow cross-site cookies
  secure: true,     // ✅ required for HTTPS (Vercel)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};




    // Set token in cookie
    res.cookie("token", token, cookieOptions);

    // Respond with user details
    res.status(200).json({
      message: "Verification successful",
      user: {
        email: user.email,
        role: user.role || "user", // fallback role
        token: token, // include token in response if needed by frontend
      },
    });
   
    
  } catch (err) {
    console.error("Error in /verify-code:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/// logut
router.post("/logout", (req, res) => {
res.clearCookie("token", {
  httpOnly: true,
  sameSite: "None",
  secure: true,
});
  return res.status(200).json({ message: "Logged out successfully" });
});

// Get current logged-in user info
router.get("/me", protect, async (req, res) => {
  

  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
   
  });
});


module.exports = router;
