const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");
const Bundle = require("../models/bundlesModel");

exports.addToCart = async (req,res) =>{
    try {
        const cartOwner = await User.findById({_id: req.user._id});
        if(!cartOwner){
            return res.status(404).json({message: "A cart should have an owner"});
        }
        const cart = await Cart.findOne({_id: cartOwner._id});


        const product = await Product.findOne({_id: req.body.product});
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        let productPrice = product.productPrice;
        let productQuantity = req.body.productQuantity;

        if(productQuantity < product.productQuantity){
            return res.status(409).json({message: "Sorry we dont have the quantity"});
        }
        let price= productPrice * productQuantity;
        product.productQuantity -= productQuantity;
        await product.save();

        if(!cart){
            const newCart = await Cart.create({
                cartOwner: cartOwner._id,
                products: [req.body.product],
                totalPrice: price,
            });
            return res.status(200).json({newCart});
        }
        cart.products.push(req.body.product);
        cart.totalPrice += price;
        await cart.save();
        return res.status(200).json({cart});
    } catch (err) {
        res.status(500).json({message: err.message});
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
            cart = await Cart.create({ cartOwner: userId });
        }

        const productIds = bundle.products.map((product) => product._id);

        cart.products.push(...productIds);

        const bundlePrice = parseFloat(bundle.discountedPrice);
        cart.totalPrice = parseFloat(cart.totalPrice) + bundlePrice;

        await cart.save();

        res.status(200).json({ message: "Bundle added to cart successfully", cart });
    } catch (err) {
        console.error("Error adding bundle to cart:", err.message);
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

