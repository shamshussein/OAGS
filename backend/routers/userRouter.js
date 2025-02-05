const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../config/multerConfig");
const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/google-auth", userController.googleAuth);
router.delete("/deleteUser", userController.protect, userController.deleteUser);
router.put("/changePassword", userController.protect, userController.changePassword);

router.put(
    "/updateProfile",
    upload.single("profilePicture"), 
    userController.protect,
    userController.updateProfile
  );
  router.put(
    "/removeProfilePicture",
    userController.protect, 
    userController.removeProfilePicture 
  );
module.exports = router;
