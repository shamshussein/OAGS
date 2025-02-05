const express = require("express");
const { processCheckout } = require("../controllers/checkoutController");
const { protect } = require("../controllers/userController");

const router = express.Router();

// Checkout Route
router.post("/",protect, processCheckout);

module.exports = router;
