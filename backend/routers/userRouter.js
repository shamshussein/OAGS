const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/google-auth", userController.googleAuth);
router.post("/deleteUser", userController.deleteUser);

module.exports = router;
