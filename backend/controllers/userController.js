const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      branchName,
      semesterNumber,
      rollNumber,
      name,
      yearNumber,
    } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const role = "user"; 

    user = new User({
      email,
      password,
      branchName,
      role,
      semesterNumber,
      rollNumber,
      name,
      yearNumber,
    });

    await user.save();

    // Return JWT
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        branchName: user.branchName,
        semesterNumber: user.semesterNumber,
        rollNumber: user.rollNumber,
        name: user.name,
        yearNumber: user.yearNumber,
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  registerUser,
};
