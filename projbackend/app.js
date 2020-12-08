require('dotenv').config()  //used to configure env file


const mongoose = require('mongoose');
const express = require("express");
const app = express();

//middlewares
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require ("cors");

//My routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")
const paymentBRoutes = require("./routes/paymentBRoutes")

//DB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex : true
}).then(()=>{
    console.log("DB CONNECTED")
});

//middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//MyRoutes  
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", paymentBRoutes)

//using PORT from env files variable
const port = process.env.PORT || 8000;


//starting a server
app.listen(port, ()=> {
    console.log(`app is running at ${port}`);
})
