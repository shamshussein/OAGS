const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartController");
const userController = require("../controllers/userController");

router.post("/addToCart", userController.protect, cartController.addToCart);
router.post("/addBundleToCart", userController.protect, cartController.addBundleToCart);
router.get('/getCartItems', userController.protect, cartController.getCartItems);

module.exports = router;
