const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

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
