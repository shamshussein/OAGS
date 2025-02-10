const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto"); 
const mongoose = require("mongoose");
const Cart = require("../models/cartModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Order = require("../models/orderModel");
const Feedback = require("../models/feedbackModel");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

exports.signup = async (req, res) => {
  try {
    const userCheck = await User.findOne({ userName: req.body.userName });
    if (userCheck) {
      return res.status(400).json({ message: 'User already exists, please sign in!' });
    }
    if (req.body.userName === '') {
      return res.status(400).json({ message: 'Please enter your username' });
    }

    const emailCheck = await User.findOne({ email: req.body.email });
    if (emailCheck) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({ message: 'Email is not valid' });
    }
    if (!validator.isMobilePhone(req.body.phoneNumber)) {
      return res.status(400).json({ message: 'Please enter a valid phone number' });
    }
    if (!validator.isStrongPassword(req.body.password)) {
      return res.status(400).json({ message: 'Provide a strong password containing at least one uppercase letter, one lowercase letter, a number, and a symbol.' });
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const newUser = await User.create({
      userName: req.body.userName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong during sign-up' });
    console.error(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await user.checkPassword(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential, email, name, phoneNumber } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (payload.email !== email) {
      return res.status(400).json({ message: 'Email mismatch with Google payload' });
    }

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      const randomPassword = crypto.randomBytes(8).toString("hex");

      user = await User.create({
        email,
        userName: name,
        phoneNumber,
        googleId: payload.sub,
        password: randomPassword,
        passwordConfirm: randomPassword,
      });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();

    await user.save();

    const newToken = signToken(user._id);

    res.status(200).json({ message: "Password changed successfully", token: newToken });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userID = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await User.findByIdAndDelete(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    await Cart.deleteMany({ cartOwner: userID });
    await Order.deleteMany({ orderOwner: userID });
    await Feedback.deleteMany({ user: userID });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profilePicture = req.file;

    const userId = req.user.id;

    const updates = {};
    if (profilePicture) {
      updates.profilePicture = `data:${profilePicture.mimetype};base64,${profilePicture.buffer.toString("base64")}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

exports.removeProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: null },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture removed successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error removing profile picture:", err.message);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

      res.json({
          message: "Copy this token and use it to reset your password.",
          resetToken
      });

  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
          return res.status(400).json({ message: "Invalid or expired token" });
      }
      user.password = newPassword;
      await user.save();
      const newToken = signToken(user._id);

      res.json({ message: "Password reset successful. You can now log in.", token : newToken });

  } catch (error) {
      res.status(400).json({ message: "Invalid or expired token" });
  }

};

// Middleware 
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      } else if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Your session token is expired. Login again" });
      }
      console.error(err);
    }

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ message: "The token owner no longer exists" });
    }
    if (currentUser.passwordChangedAfterTokenIssue(decoded.iat)) {
      return res.status(401).json({ message: "Your password has been changed. Please log in again" });
    }
    req.user = currentUser;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};
