const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: [true, "Add the product name"],
        trim: true,
        minlength:3,
        unique: true,
    },
    productDescription:{
        type: String,
        required: [true, "Add the product description"],
        trim: true,
        minlength:3,
        maxLength: 255,
    },
    productImage:{
        type: String,
        default: ""
    },
    productPrice:{
        type: Schema.Types.Decimal128,
        default: 0.00,
        required: [true, "Add the product price"]
    },
    productPrice:{
        type: Number,
        default: 0,
        required: [true, "Add the product quantity"]
    },
    productPrice:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
},
{
    timestamps: true
}
);
module.exports = mongoose.model("Product", productSchema);