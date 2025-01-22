const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: [true, "Feedback text is required"],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
