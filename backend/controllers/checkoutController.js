const Order = require("../models/orderModel"); // Assuming you have an Order model
const userController = require("../controllers/userController");
// Handle Checkout Request
exports.processCheckout = async (req, res) => {
    try {
        
        const { cart, shippingDetails } = req.body;
        
        shippingDetails.city = "bierut";
        shippingDetails.postalCode = "1234";
        
        // if (!cart || cart.length === 0) {
        //     return res.status(400).json({ message: "Cart is empty" });
        // }

        // if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode) {
        //     return res.status(400).json({ message: "Shipping details are required" });
        // }
        
        console.log(cart);
        
        // Create new order in the database
        const newOrder = new Order({
            orderOwner: req.user._id, // Assuming you have an authenticated user
            items: cart.map(item => ({
                product: item.itemId,
                quantity: item.quantity,
                price: item.itemPrice,
            })),
            shippingDetails,
            totalAmount: cart.reduce((total, item) => total + item.itemPrice * item.quantity, 0),
            status: "Pending", // Initial order status
        });

        

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", orderId: newOrder._id });
    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
