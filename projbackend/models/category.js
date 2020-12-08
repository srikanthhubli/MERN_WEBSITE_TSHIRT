const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        trim  : true,
        required: true,
        maxlength : 32,
        unique : true
    }
},{timestamps :  true}) // stored the time when created 

module.exports = mongoose.model("Category",categorySchema)