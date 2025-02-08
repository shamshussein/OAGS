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
  
      const orderItems = cart.map((item) => ({
        ...(item.itemType === "product"
          ? { product: item.itemId }
          : { bundle: item.itemId }),
        quantity: item.quantity,
        price: item.itemPrice,
        name: item.name,
        type: item.itemType,
      }));
  
      const newOrder = new Order({
        orderOwner: req.user._id,
        items: orderItems,
        shippingDetails,
        totalAmount: cart.reduce((total, item) => total + item.itemPrice * item.quantity, 0),
        orderStatus: "pending",
      });
  
      await newOrder.save();
  
      await Cart.deleteOne({ cartOwner: req.user._id });
  
      res.status(201).json({ message: "Order placed successfully", orderId: newOrder._id });
    } catch (error) {
      console.error("Checkout Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

exports.getOrders = async (req, res) => {
    try {
      const userId = req.query.userId; 
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID." });
      }
  
      const orders = await Order.find({ orderOwner: userId }).populate([
        { path: "items.product", select: "productName productDescription productImage" },
        { path: "items.bundle", select: "name description image" },
      ]);
  
      if (!orders.length) {
        return res.status(200).json({ message: "No orders found", orders: [] });
      }
  
      res.status(200).json({ orders });
    } catch (err) {
      console.error("Error fetching orders:", err.message);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };
  
  exports.cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid order ID." });
      }
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }
      if (order.orderOwner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized." });
      }
      if (order.orderStatus !== "pending") {
        return res.status(400).json({ message: "Only pending orders can be canceled." });
      }
  
      const session = await mongoose.startSession();
      session.startTransaction();
  
      for (const item of order.items) {
        if (item.type === "product") {
          const product = await Product.findById(item.product).session(session);
          if (product) {
            product.productQuantity += item.quantity;
            await product.save({ session });
          }
        } else if (item.type === "bundle") {
          const bundle = await Bundle.findById(item.bundle).populate("products").session(session);
          for (const prod of bundle.products) {
            const product = await Product.findById(prod._id).session(session);
            if (product) {
              product.productQuantity += item.quantity;
              await product.save({ session });
            }
          }
        }
      }
  
      order.orderStatus = "canceled";
      await order.save({ session });
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ message: "Order canceled successfully." });
    } catch (err) {
      console.error("Cancel order error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  exports.completedOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const orderId = req.params.orderId;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Invalid order ID." });
      }
  
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Order not found." });
      }
      if (order.orderOwner.toString() !== req.user._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ message: "Unauthorized." });
      }
      if (order.orderStatus !== "pending") {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Only pending orders can be completed." });
      }
  
      for (const item of order.items) {
        if (item.type === "product") {
          const product = await Product.findById(item.product).session(session);
          if (!product || product.productQuantity < item.quantity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: `Insufficient stock for product ${item.name}.` });
          }
          product.productQuantity -= item.quantity;
          await product.save({ session });
        } else if (item.type === "bundle") {
          const bundle = await Bundle.findById(item.bundle).populate("products").session(session);
          if (!bundle) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: `Bundle ${item.name} not found.` });
          }
          for (const prod of bundle.products) {
            if (prod.productQuantity < item.quantity) {
              await session.abortTransaction();
              session.endSession();
              return res.status(400).json({ message: `Insufficient stock for product ${prod.productName} in bundle ${bundle.name}.` });
            }
          }
          for (const prod of bundle.products) {
            const product = await Product.findById(prod._id).session(session);
            product.productQuantity -= item.quantity;
            await product.save({ session });
          }
        }
      }
  
      order.orderStatus = "completed";
      await order.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ message: "Order marked as completed." });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Complete order error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  exports.reorderOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { orderId } = req.body;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Invalid order ID." });
      }
  
      const originalOrder = await Order.findById(orderId).session(session);
      if (!originalOrder) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Original order not found." });
      }
      if (originalOrder.orderOwner.toString() !== req.user._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ message: "Unauthorized." });
      }
  
      for (const item of originalOrder.items) {
        if (item.type === "product") {
          const product = await Product.findById(item.product).session(session);
          if (!product || product.productQuantity < item.quantity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: `Insufficient stock for product ${item.name}.` });
          }
          product.productQuantity -= item.quantity;
          await product.save({ session });
        } else if (item.type === "bundle") {
          const bundle = await Bundle.findById(item.bundle).populate("products").session(session);
          if (!bundle) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: `Bundle ${item.name} not found.` });
          }
          for (const prod of bundle.products) {
            if (prod.productQuantity < item.quantity) {
              await session.abortTransaction();
              session.endSession();
              return res.status(400).json({ message: `Insufficient stock for product ${prod.productName} in bundle ${bundle.name}.` });
            }
          }
          for (const prod of bundle.products) {
            const product = await Product.findById(prod._id).session(session);
            product.productQuantity -= item.quantity;
            await product.save({ session });
          }
        }
      }
  
      const newOrder = new Order({
        orderOwner: req.user._id,
        items: originalOrder.items,
        shippingDetails: originalOrder.shippingDetails,
        totalAmount: originalOrder.totalAmount,
        orderStatus: "completed",
      });
  
      await newOrder.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({ message: "Order reordered successfully.", orderId: newOrder._id });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Reorder order error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  