const express = require("express");
const { processCheckout } = require("../controllers/checkoutController");

const router = express.Router();

// Checkout Route
router.post("/", processCheckout);

module.exports = router;
