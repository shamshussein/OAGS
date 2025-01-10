const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    orderOwner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items:[
        {
        type: Schema.Types.ObjectId,
        ref: "Product",
    }
],
    orderStatus:{
        type: String,
        default: "pending",
        enums: ["pending", "canceled", "completed"]
    },    
},
{
    timestamps: true
}
);
module.exports = mongoose.model("Order", orderSchema);