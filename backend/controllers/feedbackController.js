const Feedback = require("../models/feedbackModel");
const User = require("../models/userModel");

exports.addFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Please log in to provide feedback." });
    }

    const newFeedback = await Feedback.create({
      feedback,
      user: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: newFeedback,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "userName");

    res.status(200).json({
      status: "success",
      data: feedbacks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
