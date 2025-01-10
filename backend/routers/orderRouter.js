const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderContoller");

router.post("/newOrder", userController.protect, orderController.createNewOrder);

module.exports = router;

