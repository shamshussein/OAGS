const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");

router.post("/createProduct", 
    userController.protect,
     productController.createProduct);
router.patch("/updateProduct/:productID", userController.protect, productController.updateProduct);
router.delete("/deleteProduct/:productID", userController.protect, productController.deleteProduct);
router.get("/allProducts", productController.getAllProducts);

module.exports = router;
