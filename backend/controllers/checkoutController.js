const Order = require("../models/orderModel"); // Assuming you have an Order model

// Handle Checkout Request
exports.processCheckout = async (req, res) => {
    try {
        const { cart, shippingDetails } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode) {
            return res.status(400).json({ message: "Shipping details are required" });
        }

        // Create new order in the database
        const newOrder = new Order({
            cart,
            shippingDetails,
            totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
            status: "Pending", // Initial order status
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", orderId: newOrder._id });
    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
