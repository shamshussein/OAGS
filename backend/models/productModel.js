const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Add the product name"],
        trim: true,
        minlength: 3,
        unique: true,
    },
    productDescription: {
        type: String,
        required: [true, "Add the product description"],
        trim: true,
        minlength: 3,
        maxLength: 255,
    },
    productImage: {
        type: String,
        default: "",
    },
    productPrice: {
        type: Schema.Types.Decimal128,
        required: [true, "Add the product price"],
    },
    productQuantity: {
        type: Number,
        required: [true, "Add the product quantity"],
    },
    productCategory: {
        type: String, // Update to a simple string for the category
        required: [true, "Add the product category"],
    },
    productRating: {
        type: Number, // Rating will be a number, e.g., 4.5
        default: 0,
        min: 0,
        max: 5,
    },
    isSized: {
        type: Boolean,
        default: false, // This indicates whether the product has a size option
    },
},
{
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model("Product", productSchema);
