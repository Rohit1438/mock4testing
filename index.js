const express = require("express");
const cors = require("cors");
// const { connection } = require("./config/db");

const mongoose=require("mongoose")

const { userRouter } = require(". /routes/user.route");
const { auth } = require("./middleware/auth.middleware");
const { postRouter } = require("./routes/post.route");
require("dotenv").config();

const app = express();
app.use(express.json()) ;
app.use(cors());

app.use("/users",userRouter);
app.use("/posts",auth,postRouter);

const connection=async()=>{
    try{
    
        await mongoose.connect("mongodb+srv://Rohit2002:20022003@cluster0.riuail2.mongodb.net/mockyy1?retryWrites=true&w=majority")
    
    console.log("Connected to mongoose")
    }catch(err){
        console.log(err)
    }
    }
app.listen(process.env.PORT , async() => {
try {
    await connection();
    console.log("Connected");

} catch (error) {
 console.log(error.message)   
}
})