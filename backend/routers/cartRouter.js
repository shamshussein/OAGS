const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");

// POST request to add a product to the cart (requires authentication)
router.post("/addToCart", userController.protect, cartController.addToCart);

module.exports = router;
