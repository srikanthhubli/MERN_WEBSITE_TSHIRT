const mongoose = require("mongoose")
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')


//var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type : String,
        required : true,
        maxlength : 32,
        trim: true
    },

    lastName : {
        type : String,
        maxlength : 32,
        required: true,
        trim : true
    },

    userinfo : {
        type :String,
        trim : true
    },

    email : {
        type : String,
        trim : true,
        required : true, 
        unique : true
    },

    encry_password : {
        type: String,
        required : true
    },

    salt : String,

    role : {
        type: Number,
        default : 0
    },

    purchases : {
        type : Array,
        default : []
    }
},{timestamps :  true}); // stores when it was created wrt time


//used to describe all the virtual functions required for user.js file
userSchema.virtual("password")
    .set(function(password){
        this._password = password // this._ shows private password
        this.salt = uuidv1()
        this.encry_password = this.securePassword(password)
    })
    .get(function(){
        return this._password
    })

    //used to describe all the function required for user.js file
userSchema.methods = { 

    autheticate : function (plainpassword){
        //console.log(this.securePassword(plainpassword))
        //console.log(this.encry_password)
        return this.securePassword(plainpassword) === this.encry_password
    },


    securePassword : function(plainpassword){
        if(!plainpassword) return "";
        try {
                return crypto.createHmac('sha256', this.salt)
                .update(plainpassword)
                .digest('hex');

        }
        catch (err)
        {
            return "";
        }
    }
}


//This is just like mapping the whole schema to a new variable for conventional purpose 
module.exports = mongoose.model("User", userSchema)