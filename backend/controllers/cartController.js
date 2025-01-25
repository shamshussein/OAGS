const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");
const Bundle = require("../models/bundlesModel"); 

exports.addToCart = async (req, res) => {
    try {
      const product = await Product.findById(req.body.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      const productQuantity = req.body.productQuantity || 1;
  
      if (productQuantity > product.productQuantity) {
        return res.status(409).json({ message: "Insufficient product quantity available" });
      }
  
      product.productQuantity -= productQuantity;
      await product.save();
  
      const userId = req.user._id;
  
      let cart = await Cart.findOne({ cartOwner: userId });
      if (!cart) {
        cart = await Cart.create({ cartOwner: userId, cartItems: [], totalPrice: 0 });
      }
  
      const existingProductIndex = cart.cartItems.findIndex(
        (item) => item.itemType === "product" && item.itemId.toString() === product._id.toString()
      );
  
      const productPrice = parseFloat(product.productPrice) * productQuantity; 
  
      if (existingProductIndex !== -1) {
        cart.cartItems[existingProductIndex].quantity += productQuantity;
        cart.cartItems[existingProductIndex].itemPrice = (
          parseFloat(cart.cartItems[existingProductIndex].itemPrice) + productPrice
        ).toFixed(2);
      } else {
        const productDetails = {
          name: product.productName,
          description: product.productDescription,
          image: product.productImage,
        };
        
        cart.cartItems.push({
          itemType: "product",
          itemId: product._id,
          quantity: productQuantity,
          itemPrice: productPrice.toFixed(2),
          ...productDetails, 
        });
        
      }
  
      cart.totalPrice = (parseFloat(cart.totalPrice) + productPrice).toFixed(2);
      await cart.save();
  
      res.status(200).json({ message: "Product added to cart successfully", cart });
    } catch (err) {
      console.error("Error adding product to cart:", err.message);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };
  
  exports.addBundleToCart = async (req, res) => {
    try {
      const { bundleId } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(bundleId)) {
        return res.status(400).json({ message: "Invalid bundle ID" });
      }
  
      const bundle = await Bundle.findById(bundleId).populate("products");
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }
  
      const userId = req.user._id;
  
      let cart = await Cart.findOne({ cartOwner: userId });
      if (!cart) {
        cart = await Cart.create({ cartOwner: userId, cartItems: [], totalPrice: 0 });
      }
  
      const existingBundleIndex = cart.cartItems.findIndex(
        (item) => item.itemType === "bundle" && item.itemId.toString() === bundle._id.toString()
      );
  
      const bundlePrice = parseFloat(bundle.discountedPrice);
  
      if (existingBundleIndex !== -1) {
        cart.cartItems[existingBundleIndex].quantity += 1;
        cart.cartItems[existingBundleIndex].itemPrice = (
          parseFloat(cart.cartItems[existingBundleIndex].itemPrice) + bundlePrice
        ).toFixed(2);
      } else {

        const bundleDetails = {
          name: bundle.name,
          description: bundle.description,
          image: bundle.image,
        };
        
        cart.cartItems.push({
          itemType: "bundle",
          itemId: bundle._id,
          quantity: 1,
          itemPrice: bundlePrice.toFixed(2),
          ...bundleDetails,
        });
        

      }
  
      cart.totalPrice = (parseFloat(cart.totalPrice) + bundlePrice).toFixed(2);
      await cart.save();
  
      res.status(200).json({ message: "Bundle added to cart successfully", cart });
    } catch (err) {
      console.error("Error adding bundle to cart:", err.message);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };
  
  exports.getCartItems = async (req, res) => {
    try {
      const userId = req.query.userId;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID." });
      }
  
      const cart = await Cart.findOne({ cartOwner: userId }).populate({
        path: "cartItems.itemId",
        select: "productName bundleName productDescription productImage",
      });
      
      
      if (!cart || cart.cartItems.length === 0) {
        return res.status(200).json({ message: "Cart is empty", cartItems: [] });
      }
  
      res.status(200).json({ cartItems: cart.cartItems, totalPrice: cart.totalPrice });
    } catch (err) {
      console.error("Error fetching cart items:", err.message);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };
  
  
