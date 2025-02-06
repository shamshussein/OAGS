const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Bundle = require("../models/bundlesModel");
const Cart = require("../models/cartModel");
const mongoose = require("mongoose");

exports.processCheckout = async (req, res) => {
    try {
        const { cart, shippingDetails } = req.body;
        
        if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode) {
            return res.status(400).json({ message: "All shipping details are required." });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        const orderItems = [];

        for (const item of cart) {
            if (item.itemType === "product") {
                const product = await Product.findById(item.itemId).session(session);
                if (!product || product.productQuantity < item.quantity) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ message: `Insufficient stock for ${item.name}.` });
                }
                product.productQuantity -= item.quantity;
                await product.save({ session });

                orderItems.push({
                    ...(item.itemType === "product" ? { product: item.itemId } : { bundle: item.itemId }),
                    quantity: item.quantity,
                    price: item.itemPrice,
                    name: item.name,
                    type: item.itemType,
                });
                

            } else if (item.itemType === "bundle") {
                const bundle = await Bundle.findById(item.itemId).populate("products").session(session);
                if (!bundle) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ message: `Bundle ${item.name} not found.` });
                }

                for (const product of bundle.products) {
                    if (product.productQuantity < item.quantity) {
                        await session.abortTransaction();
                        session.endSession();
                        return res.status(400).json({ message: `Insufficient stock for ${product.productName} in bundle ${bundle.name}.` });
                    }
                }

                for (const product of bundle.products) {
                    product.productQuantity -= item.quantity;
                    await product.save({ session });
                }

                orderItems.push({
                    bundle: item.itemId,
                    quantity: item.quantity,
                    price: item.itemPrice,
                    name: item.name,
                    type: "bundle",
                });
            }
        }

        const newOrder = new Order({
            orderOwner: req.user._id,
            items: orderItems,
            shippingDetails,
            totalAmount: cart.reduce((total, item) => total + item.itemPrice * item.quantity, 0),
            status: "Pending",
        });

        await newOrder.save({ session });

        await Cart.deleteOne({ cartOwner: req.user._id }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: "Order placed successfully", orderId: newOrder._id });

    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
