
const express = require("express")
const router = express.Router()


/* Include getAllUsers to get all the users data which is fetched from controllers/user.js
const {getUserById, getUser , getAllUsers} = require("../controllers/user")*/
const {getUserById, getUser , updateUser, userPurchaseList} = require("../controllers/user")
const {isSignedIn, isAuthenticated , isAdmin} = require("../controllers/auth")


router.param("userId", getUserById)

router.get("/user/:userId", isSignedIn, isAuthenticated,  getUser)
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)


router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)

module.exports = router;


//router.get("/users", getAllUsers)