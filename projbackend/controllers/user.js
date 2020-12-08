const User = require("../models/user");
const Order = require("../models/order")


exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) =>{
        if(err || !user){
            return resizeBy.status(400).json({
                error : " No user was found in DB"
            })
        }
        //creating an object 
        req.profile = user 
        next()
    })
};

exports.getUser = (req,res) => {

    //TODO: get back here for password
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.json(req.profile)
};

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set: req.body},
        {new : true , useFindAndModify : false},

        (err, user) => {
            if(err || !user){
                res.status(400).json({
                    error : "You are not authorised to update this information/user"
                })
            }
            user.salt = undefined
            user.encry_password = undefined
            user.createdAt = undefined
            user.updatedAt = undefined
            res.json(user)
        } 
    )
};


exports.userPurchaseList = (req, res) => {

    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No order in this account "
            })
        }

        return res.json(order)

    })

}

//A middleware 
exports.pushOrderInPurchaseList = (req,res, next) => {

    let purchases = []
    // orders are going to come from req.body.order which is frm the front end 
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category : product.category,
            quantity : product.quantity,
            amount: req.body.order.amount, 
            transaction_id: req.body.order.transaction_id
        })
    })


    //store this in DB
    User.findOneAndUpdate(
        {id: req.profile._id},
        {$push: {purchases: purchases}},
        {new:true},
        (err, purchase) => {

            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
            next()
        }
    )



}

/* To get all users data at once
exports.getAllUsers = (req, res ) => {
    
    User.find().exec((err, users) => {
         
        if(err || !users){
            return res.status(400).json({
                error : "No users found"
            })
        }
        res.json(users)

    })

}*/