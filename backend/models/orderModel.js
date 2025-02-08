const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        orderOwner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
                bundle: { type: mongoose.Schema.Types.ObjectId, ref: "Bundle", required: false },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                name: { type: String, required: true },
                type: { type: String, enum: ["product", "bundle"], required: true },
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        shippingDetails: {
            address: { type: String, required: true },
            city: { type: String, required: false },
            postalCode: { type: String, required: false },
        },
        orderStatus: {
            type: String,
            enum: ["pending", "canceled", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
