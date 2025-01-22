const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bundleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Add the bundle name"],
        unique: true,
        trim: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product", 
            required: true,
        },
    ],
    image: {
        type: String,
        default: "",
    },
    discountedPrice: {
        type: Schema.Types.Decimal128,
        required: [true, "Add the discounted price"],
    },
    originalPrice: {
        type: Schema.Types.Decimal128,
        required: [true, "Add the original price"],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Bundle", bundleSchema);
