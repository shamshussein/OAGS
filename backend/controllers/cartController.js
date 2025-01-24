const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

// Add to Cart
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user._id;

        // Verify that the user exists
        const cartOwner = await User.findById(userId);
        if (!cartOwner) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retrieve the cart for the user, or create a new one if it doesn't exist
        let cart = await Cart.findOne({ userId });

        // Retrieve the product to be added
        const product = await Product.findById(req.body.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const productQuantity = req.body.quantity;

        // Check if the requested quantity is available
        if (productQuantity > product.productQuantity) {
            return res.status(409).json({ message: "Insufficient product quantity in stock" });
        }

        // Calculate price for the product being added
        const itemPrice = product.productPrice * productQuantity;
        const discountedPrice = product.discountedPrice * productQuantity;

        // Update product stock
        product.productQuantity -= productQuantity;
        await product.save();

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [
                    {
                        productId: product._id,
                        name: product.productName,
                        price: product.productPrice,
                        discountedPrice: product.discountedPrice,
                        quantity: productQuantity,
                    },
                ],
                subtotal: discountedPrice,
                discount: itemPrice - discountedPrice,
                total: discountedPrice, // Assuming deliveryFee and taxes are 0 for now
            });
            return res.status(200).json({ cart });
        }

        // If cart exists, update it
        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === product._id.toString()
        );

        if (existingItemIndex >= 0) {
            // Update quantity and price for the existing item
            cart.items[existingItemIndex].quantity += productQuantity;
            cart.items[existingItemIndex].price += itemPrice;
            cart.items[existingItemIndex].discountedPrice += discountedPrice;
        } else {
            // Add new item to the cart
            cart.items.push({
                productId: product._id,
                name: product.productName,
                price: product.productPrice,
                discountedPrice: product.discountedPrice,
                quantity: productQuantity,
            });
        }

        // Recalculate cart totals
        cart.subtotal += discountedPrice;
        cart.discount += itemPrice - discountedPrice;
        cart.total = cart.subtotal; // Assuming deliveryFee and taxes are 0 for now

        await cart.save();
        return res.status(200).json({ cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const removedItem = cart.items[itemIndex];
        cart.subtotal -= removedItem.discountedPrice;
        cart.discount -= removedItem.price - removedItem.discountedPrice;
        cart.total = cart.subtotal; // Update total

        cart.items.splice(itemIndex, 1);

        await cart.save();
        return res.status(200).json({ cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Item Quantity in Cart
exports.updateItemQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const currentQuantity = cart.items[itemIndex].quantity;

        if (quantity > currentQuantity) {
            const additionalQuantity = quantity - currentQuantity;

            if (additionalQuantity > product.productQuantity) {
                return res.status(409).json({ message: "Insufficient product quantity in stock" });
            }

            product.productQuantity -= additionalQuantity;
        } else {
            const returnedQuantity = currentQuantity - quantity;
            product.productQuantity += returnedQuantity;
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.productPrice * quantity;
        cart.items[itemIndex].discountedPrice = product.discountedPrice * quantity;

        cart.subtotal = cart.items.reduce((acc, item) => acc + item.discountedPrice, 0);
        cart.discount = cart.items.reduce((acc, item) => acc + (item.price - item.discountedPrice), 0);
        cart.total = cart.subtotal; // Update total

        await product.save();
        await cart.save();

        return res.status(200).json({ cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Clear Cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        cart.subtotal = 0;
        cart.discount = 0;
        cart.total = 0;

        await cart.save();

        return res.status(200).json({ message: "Cart cleared", cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Calculate Delivery Fee and Taxes (mocked for simplicity)
const calculateDeliveryFee = () => 50; // Mock delivery fee
const calculateTaxes = (subtotal) => subtotal * 0.1; // Mock 10% tax

// Checkout
exports.checkout = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        cart.deliveryFee = calculateDeliveryFee();
        cart.taxes = calculateTaxes(cart.subtotal);
        cart.total = cart.subtotal + cart.deliveryFee + cart.taxes;

        await cart.save();

        return res.status(200).json({ message: "Checkout successful", cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
