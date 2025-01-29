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
      return res.status(409).json({
        message: "Insufficient product quantity available. Maximum stock reached.",
      });
    }

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
      const newQuantity =
        cart.cartItems[existingProductIndex].quantity + productQuantity;

      if (newQuantity > product.productQuantity) {
        return res.status(409).json({
          message: "Cannot add more items. Maximum stock reached.",
        });
      }

      cart.cartItems[existingProductIndex].quantity = newQuantity;
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
  
  exports.removeItem = async (req, res) => {
    try {
      const { itemId } = req.body; 
      const userId = req.user.id; 
  
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: "Invalid item ID." });
      }
  
      const cart = await Cart.findOne({ cartOwner: userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found." });
      }
  
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.itemId.toString() === itemId
      );
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart." });
      }
  
      const removedItem = cart.cartItems[itemIndex];
      cart.cartItems.splice(itemIndex, 1);
      cart.totalPrice -= removedItem.itemPrice;
  
      await cart.save();
  
      res.status(200).json({ message: "Item removed successfully", cart });
    } catch (err) {
      console.error("Error removing item from cart:", err.message);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };

  exports.clearCart = async (req, res) => {
    try {
      // const cartId = req.body; 
      const userId = req.user.id; 

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID." });
      }
      
      const cart = await Cart.findOneAndDelete({ cartOwner: userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found." });
      }
     res.status(200).json({message: "cart deleted successfully"});
      } catch (err) {
      console.error("Error removing item from cart:", err.message);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };

  exports.updateCartItemQuantity = async (req, res) => {
    try {
      const { itemId, newQuantity } = req.body;
      const userId = req.user._id;
  
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: "Invalid item ID." });
      }
  
      const cart = await Cart.findOne({ cartOwner: userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found." });
      }
  
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.itemId.toString() === itemId
      );
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart." });
      }
  
      const product = await Product.findById(cart.cartItems[itemIndex].itemId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      if (newQuantity > product.productQuantity) {
        return res.status(409).json({ message: "Insufficient product quantity available." });
      }
  
      const oldQuantity = cart.cartItems[itemIndex].quantity;
      const pricePerUnit = cart.cartItems[itemIndex].itemPrice / oldQuantity;
  
      cart.cartItems[itemIndex].quantity = newQuantity;
      cart.cartItems[itemIndex].itemPrice = (pricePerUnit * newQuantity).toFixed(2);
  
      cart.totalPrice = cart.cartItems.reduce((total, item) => total + parseFloat(item.itemPrice), 0).toFixed(2);
  
      await cart.save();
  
      res.status(200).json({ message: "Cart item quantity updated successfully", cart });
    } catch (err) {
      console.error("Error updating cart item quantity:", err.message);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };