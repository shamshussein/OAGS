const mongoose = require("mongoose");

const bundleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
    imagebanner: { type: String, required: true},
    rating: { 
        type: Number, 
        default: 0,
        min: 0,     
        max: 5,     
    },
});

module.exports = mongoose.model('Bundle', bundleSchema);

