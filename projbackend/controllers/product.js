const Product = require("../models/product")
const product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")
const { sortBy } = require("lodash")



exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product)=> {
        if(err){
            return res.status(400).json({
                error: "Product not found"
            })
        }

        req.product = product
        next()

    })
    //
}


exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;


    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image "
            })
        }


        //destructure the fields
        const {name , description , price, category , stock , } = fields

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock 
        ){

            return res.status(400).json({
                error: "Please include all fields"
            })

        }


        
        let product = new Product(fields)

        //handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "File size too big!!!"
                })
            }


            // 'file' given by formidable in parse
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        
        }

        //console.log(product)


        //save to the db
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error : "Saving tshirt in DB failed "
                })
            }

            res.json(product)
        })
    })
 }

exports.getProduct = (req,res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//middleware
exports.photo = (req, res, next)=> {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.deleteProduct = (req, res) => {

    let product = req.product
    product.remove((err, deletedProducted) => {
        if(err){
            return res.status(400).json({
                error : "Failed to delete the product"
            })
        }

        res.json({
            message : "Deletion was successful", deletedProducted
        }) 
    })

}

exports.updateProduct = (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true;


    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image "
            })
        }


        //updation of code 
        let product = req.product

        //this updates the product to already existing fields refer documentation for further info , this comes from lodash
        product = _.extend(product, fields)

        //handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "File size too big!!!"
                })
            }


            // 'file' given by formidable in parse
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        
        }

        //save to the db
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error : "updation of product failed "
                })
            }

            res.json(product)
        })
    })
    

}

//Product listing

exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
     .select("-photo")
     .populate("category")
     .sort([[sortBy, "asc"]])
     .limit(limit)
     .exec((err, products) => {
         if(err){
             return res.status(400).json({
                 error: "No products found"
             })
         }

         res.json(products)
     })
     
}

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error : "No Category Found"
            })

        }

        res.json(category)
    })
}


exports.updateStock = (req,res, next) => {
        //creating operation for bulkWrite and looping through it
    let myOperations = req.body.order.products.map(prod => {

        return {
            updateOne : {
                //operation performed
                filter : {_id: prod._id},
                update: {$inc: {stock: -prod.count , sold: +prod.count}}
            }
        }

    })

    Product.bulkWrite(muOperations , {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error : "Bulk operation error"
            })

        }
        next()
    })

}