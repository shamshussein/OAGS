const Bundle = require('../models/bundlesModel');

const createBundle = async (req, res) => {
    try {
        const { name, products, image, discountedPrice, originalPrice } = req.body;

        if (!name || !products || !discountedPrice || !originalPrice) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newBundle = new Bundle({
            name,
            products,
            image,
            discountedPrice,
            originalPrice,
        });

        const savedBundle = await newBundle.save();
        res.status(201).json(savedBundle);
    } catch (error) {
        console.error("Error creating bundle:", error.message);
        res.status(500).json({ message: "Failed to create bundle.", error: error.message });
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
