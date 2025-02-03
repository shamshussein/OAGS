const Bundle = require('../models/bundlesModel');
const Product = require('../models/productModel');
const mongoose = require("mongoose");

const createBundle = async (req, res) => {
    try {
        const { name, image, products, imagebanner, rating } = req.body;

        if (!name || !image || !products || !imagebanner) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const productIds = products.map((id) => new mongoose.Types.ObjectId(id));

        const productDetails = await Product.find({ _id: { $in: productIds } });

        let originalPrice = 0;

        productDetails.forEach((product) => {
            originalPrice += parseFloat(product.productPrice.toString());
        });

        const newBundle = await Bundle.create({
            name,
            image,
            originalPrice,
            products: productIds,
            imagebanner,
            rating,
        });

        res.status(201).json(newBundle);
    } catch (err) {
        console.error("Error creating bundle:", err.message);
        res.status(400).json({ message: err.message });
    }
};

const getAllBundles = async (req, res) => {
    try {
        const bundles = await Bundle.find().populate('products');

        const availableBundles = bundles.filter(bundle => {
            return bundle.products.every(product => product.productQuantity > 0);
        });

        const formattedBundles = availableBundles.map(bundle => ({
            ...bundle._doc,
            originalPrice: parseFloat(bundle.originalPrice.toString()),
        }));

        res.status(200).json(formattedBundles);
    } catch (error) {
        console.error("Error fetching bundles:", error.message);
        res.status(500).json({ message: "Failed to fetch bundles.", error: error.message });
    }
};

module.exports = {
    createBundle,
    getAllBundles,
};