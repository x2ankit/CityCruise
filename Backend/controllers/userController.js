const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require('../models/blacklistTokenModel');

// REGISTER
exports.registerController = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    // User model already hashes password in pre-save hook. Create with plain password.
    const user = await User.create({ fullname, email, password });

    // Generate token and return created user (without password)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json({ message: 'User created successfully', user: safeUser, token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    // Sign token with `_id` to match auth middleware expectations
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({ message: "Login successful", user: safeUser, token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
exports.logoutController = async (req, res) => {
  // Blacklist token so it cannot be reused
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (token) {
    try {
      await blacklistTokenModel.create({ token });
    } catch (err) {
      // ignore duplicate key or other minor errors
    }
  }

  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};
