const express = require('express');
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const userController = require("../controllers/userController");

router.post("/sendFeedback",userController.protect, feedbackController.addFeedback);
router.get("/getFeedbacks", feedbackController.getFeedbacks);

module.exports = router;
