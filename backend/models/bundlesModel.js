const mongoose = require("mongoose");

const bundleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
});

const Bundle = mongoose.model("Bundle", bundleSchema);
module.exports = Bundle;
