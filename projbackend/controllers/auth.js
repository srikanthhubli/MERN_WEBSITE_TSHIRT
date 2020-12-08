const User = require("../models/user");
const { check , validationResult } = require('express-validator');
//for creating tokens 
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const router = require("../routes/auth");

exports.signup = (req, res) => {
  //Checking validation 

  const errors = validationResult(req)

  if(!errors.isEmpty())
  {
    return res.status(422).json({
      error : errors.array()[0].msg,
    })
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      //console.log(err)
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    //res.json(user)
    res.json({
      name: user.name,
      lastname :  user.lastname,
      email: user.email,
      id: user._id

    });
  });
};

exports.signin =(req,res) => {

  const errors = validationResult(req)
  //destructuring extractring 
  const { email , password } = req.body

  if(!errors.isEmpty())
  {
    return res.status(422).json({
      error : errors.array()[0].msg,
    })
  }

  User.findOne({email},  (err, user) => {
    if(err || !user){ //!user represents ther's no user
      return res.status(400).json({
        error : "user email dosen't exist"
      })
    }

    if(!user.autheticate(password)){

        return res.status(401).json ({
            error : "Email and password dosent match"
        })
    }
       
      //create Token
      const token = jwt.sign({_id : user._id},"MYSECTERCODE")

      //put token in cookie
      res.cookie("token", token , {expire : new Date() + 9999})

      //send res to front end

      const {_id, name, email, role } = user
      return res.json({token, user : {_id, name, email , role }})


    })


} 


exports.signout = (req, res) => {

  res.clearCookie("token")
  res.json({
    message: "User signout successfull "
  });
};

//protected routes 
exports.isSignedIn = expressJwt({
  
  secret: process.env.SECRET, 
  userProperty : "auth"
})

//custom middlewares

exports.isAuthenticated = (req,res, next) => {
  let checker = req.profile && req.auth  && req.profile._id == req.auth._id;
  if (!checker){
    return res.status(403).json({
      error : "ACCESS DENIED"
    })

  }
  next()
}

exports.isAdmin = (req , res , next) => {

  if(req.profile.role === 0){
    return res.status(403).json({
      error :"You are not admin"
    })
  }

  next()
}

//Note === checks the object itself where as == checks the values