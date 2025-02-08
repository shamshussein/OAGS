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
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
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
        timestamps: true, // Automatically adds createdAt & updatedAt
    }
);

module.exports = mongoose.model("Order", orderSchema);
