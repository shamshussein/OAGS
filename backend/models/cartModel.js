const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cartItems: [
    {
      itemType: { 
        type: String,
        enum: ["product", "bundle"],
        required: true 
    },
      itemId: {
         type: mongoose.Schema.Types.ObjectId,
          required: true, 
          refPath: "cartItems.itemType" },

      quantity: { 
        type: Number, 
        default: 1
     },
      itemPrice: { 
        type: mongoose.Types.Decimal128, 
        required: true }, 
    },
  ],
  totalPrice: { type: mongoose.Types.Decimal128, default: 0.0 }, 
});

module.exports = mongoose.model("Cart", cartSchema);
