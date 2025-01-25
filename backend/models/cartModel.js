const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  itemType: { type: String, enum: ["product", "bundle"], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, refPath: "itemType" },
  quantity: { type: Number, required: true },
  itemPrice: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  cartOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
});

module.exports = mongoose.model("Cart", cartSchema);
