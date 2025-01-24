const Bundle = require('../models/bundlesModel');
const mongoose = require("mongoose");

const createBundle = async (req, res) => {
    try {
        const { name, image, originalPrice, discountedPrice, products } = req.body;

        const productIds = products.map((id) => new mongoose.Types.ObjectId(id));

        const newBundle = await Bundle.create({
            name,
            image,
            originalPrice,
            discountedPrice,
            products: productIds,
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

        const formattedBundles = bundles.map(bundle => ({
            ...bundle._doc,
            discountedPrice: parseFloat(bundle.discountedPrice.toString()),
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
