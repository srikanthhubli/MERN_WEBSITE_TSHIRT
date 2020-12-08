const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
    //It is based on the prev product
    product : {
        type :ObjectId,
        ref : "Product"
    },
    name :String,
    count : Number,
    price : Number,

});



const OrderSchema = new mongoose.Schema ({
    // array of the same prodct
    products : [ProductCartSchema],
    transaction_id: {},
    amount : {type : Number},
    address : String,
    status: {
        type : String,
        default : "Recived",
        //enums are used to choose only from this section of options on the status 
        enum : ["Cancelled", "Delivered", "Shipped", "Processing ", "Recived"]
    },
    updated: Date,
    user : {
        type : ObjectId,
        ref : "User"
    }
}, {timestamp: true});

const Order = mongoose.model("Order",OrderSchema);
const ProductCart = mongoose.model("ProductCart",ProductCartSchema);

module.exports= {Order,ProductCart}