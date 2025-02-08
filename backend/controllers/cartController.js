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

    const userId = req.user._id;
    let cart = await Cart.findOne({ cartOwner: userId });
    if (!cart) {
      cart = await Cart.create({ cartOwner: userId, cartItems: [], totalPrice: 0 });
    }

    const productQuantity = req.body.productQuantity || 1;

    let totalUsedQuantity = 0;
    for (const item of cart.cartItems) {
      if (item.itemType === "product" && item.itemId.toString() === product._id.toString()) {
        totalUsedQuantity += item.quantity;
      } else if (item.itemType === "bundle") {
        const bundle = await Bundle.findById(item.itemId).populate("products");
        if (bundle && bundle.products.some(p => p._id.toString() === product._id.toString())) {
          totalUsedQuantity += item.quantity;
        }
      }
    }

    if (totalUsedQuantity + productQuantity > product.productQuantity) {
      return res.status(409).json({
        message: `Insufficient stock.`,
      });
    }

    const existingProduct = cart.cartItems.find(
      (item) => item.itemType === "product" && item.itemId.toString() === product._id.toString()
    );

    const productPrice = parseFloat(product.productPrice) * productQuantity;

    if (existingProduct) {
      existingProduct.quantity += productQuantity;
      existingProduct.itemPrice = (parseFloat(existingProduct.itemPrice) + productPrice).toFixed(2);
    } else {
      cart.cartItems.push({
        itemType: "product",
        itemId: product._id,
        quantity: productQuantity,
        itemPrice: productPrice.toFixed(2),
        name: product.productName,
        description: product.productDescription,
        image: product.productImage,
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
    const { bundleId, quantity = 1 } = req.body;

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

    let maxBundleQuantity = Infinity;

    const existingBundleIndex = cart.cartItems.findIndex(
      (item) => item.itemType === "bundle" && item.itemId.toString() === bundle._id.toString()
    );

    for (const product of bundle.products) {
      let totalUsedQuantity = 0;

      for (const item of cart.cartItems) {
        if (item.itemType === "product" && item.itemId.toString() === product._id.toString()) {
          totalUsedQuantity += item.quantity;
        } else if (item.itemType === "bundle") {
          const existingBundle = await Bundle.findById(item.itemId).populate("products");
          if (existingBundle && existingBundle.products.some(p => p._id.toString() === product._id.toString())) {
            totalUsedQuantity += item.quantity;
          }
        }
      }

      if (existingBundleIndex !== -1) {
        totalUsedQuantity -= cart.cartItems[existingBundleIndex].quantity;
      }

      maxBundleQuantity = Math.min(maxBundleQuantity, product.productQuantity - totalUsedQuantity);
    }

    if (quantity > maxBundleQuantity) {
      return res.status(409).json({ message: `Cannot add more bundles. Available: ${maxBundleQuantity}, Requested: ${quantity}.` });
    }

    const bundlePrice = parseFloat(bundle.originalPrice) * quantity;

    if (existingBundleIndex !== -1) {
      const newQuantity = cart.cartItems[existingBundleIndex].quantity + quantity;

      if (newQuantity > maxBundleQuantity) {
        return res.status(409).json({
          message: `Cannot add more bundles. Maximum available quantity is ${maxBundleQuantity}.`,
        });
      }
      cart.cartItems[existingBundleIndex].quantity = newQuantity;
      cart.cartItems[existingBundleIndex].itemPrice = (
        parseFloat(cart.cartItems[existingBundleIndex].itemPrice) + bundlePrice
      ).toFixed(2);
    } else {
      cart.cartItems.push({
        itemType: "bundle",
        itemId: bundle._id,
        quantity: quantity,
        itemPrice: bundlePrice.toFixed(2),
        name: bundle.name,
        image: bundle.image,
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

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId, newQuantity } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const cart = await Cart.findOne({ cartOwner: userId }).populate({
      path: "cartItems.itemId",
      populate: { path: "products", select: "_id productQuantity" },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.itemId._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    const cartItem = cart.cartItems[itemIndex];
    let product = null;
    let maxAvailableQuantity = 0;

    if (cartItem.itemType === "bundle") {
      const bundle = await Bundle.findById(cartItem.itemId).populate({
        path: "products",
        select: "_id productQuantity",
      });

      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found." });
      }

      let lowestStockProduct = null;

      for (const productInBundle of bundle.products) {
        let totalUsedQuantity = 0;

        for (const item of cart.cartItems) {
          if (item.itemType === "product" && item.itemId._id.toString() === productInBundle._id.toString()) {
            totalUsedQuantity += item.quantity;
          } else if (item.itemType === "bundle") {
            const existingBundle = await Bundle.findById(item.itemId).populate("products");
            if (existingBundle && existingBundle.products.some(p => p._id.toString() === productInBundle._id.toString())) {
              totalUsedQuantity += item.quantity;
            }
          }
        }

        totalUsedQuantity -= cartItem.quantity;

        let availableForThisProduct = productInBundle.productQuantity - totalUsedQuantity;
        if (lowestStockProduct === null || availableForThisProduct < maxAvailableQuantity) {
          maxAvailableQuantity = availableForThisProduct;
          lowestStockProduct = productInBundle;
        }
      }

      if (newQuantity > maxAvailableQuantity) {
        return res.status(409).json({
          message: `Cannot add more bundles. Available: ${maxAvailableQuantity}, Requested: ${newQuantity}.`,
        });
      }

      cartItem.quantity = newQuantity;
      cartItem.itemPrice = (parseFloat(bundle.originalPrice) * newQuantity).toFixed(2);
    } else {
      product = await Product.findById(cartItem.itemId);

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      let totalUsedQuantity = newQuantity;

      for (const item of cart.cartItems) {
        if (item.itemType === "bundle") {
          const bundle = await Bundle.findById(item.itemId).populate("products");
          if (bundle && bundle.products.some(p => p._id.toString() === product._id.toString())) {
            totalUsedQuantity += item.quantity;
          }
        }
      }

      if (totalUsedQuantity > product.productQuantity) {
        return res.status(409).json({
          message: `Cannot add more. Available: ${product.productQuantity}, Requested: ${totalUsedQuantity}.`,
        });
      }

      cartItem.quantity = newQuantity;
      cartItem.itemPrice = (parseFloat(product.productPrice) * newQuantity).toFixed(2);
    }

    cart.totalPrice = cart.cartItems.reduce((total, item) => total + parseFloat(item.itemPrice), 0).toFixed(2);
    await cart.save();

    res.status(200).json({ message: "Cart item quantity updated successfully", cart });
  } catch (err) {
    console.error("Error updating cart item quantity:", err.message);
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
        select: "productName name productDescription productImage",
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

 
