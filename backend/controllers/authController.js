import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// ✅ Fix: Ensure `registerUser` function is properly defined
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// ✅ Fix: Ensure `loginUser` function is properly defined
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🟢 Login Request Received:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("🔴 User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("🔴 Password does not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ User authenticated:", user.role);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

