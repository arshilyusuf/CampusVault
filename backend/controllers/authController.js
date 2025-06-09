const jwt = require("jsonwebtoken");
const User = require("../models/User");


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        branchName: user.branchName,
        yearNumber: user.yearNumber,
        semesterNumber: user.semesterNumber,
        rollNumber: user.rollNumber,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.user });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isAuthenticated = async (req, res) => {
  let token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  token = token.trim(); 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id; 
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      isAuthenticated: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        branchName: user.branchName,
        yearNumber: user.yearNumber,
        semesterNumber: user.semesterNumber,
        rollNumber: user.rollNumber,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { login, isAuthenticated };