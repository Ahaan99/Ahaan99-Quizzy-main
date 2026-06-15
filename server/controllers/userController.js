const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_EXPIRY = "7d";
const COOKIE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

// ✅
exports.register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword, role } = req.body;

    if (!username || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ success: false, error: "Please fill all the fields" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Password and Confirm Password should be same" });
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ success: false, error: "Email is already registered, Please log in" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ success: false, error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    return res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("ERROR WHILE REGISTERING THE NEW USER:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Please fill all the fields" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    const options = {
      expires: new Date(Date.now() + COOKIE_EXPIRY_MS),
      httpOnly: true,
      sameSite: "strict",
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          attemptedQuizzes: user.attemptedQuizzes || [],
        },
      },
    });
  } catch (error) {
    console.error("ERROR WHILE LOGGING IN THE USER:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
