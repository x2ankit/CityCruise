const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerController = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ fullname, email, password: hashedPassword });

    return res.status(201).json({ message: "User created successfully" });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};
