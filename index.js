const express=require("express")
const mongoose=require("mongoose")
const userRouter = require("./routes/userRouter")

const cors = require("cors"); // Import the cors package

const app = express();

app.use(express.json());
app.use(cors()); // Use cors middleware to enable CORS

const connection=async()=>{
try{

    await mongoose.connect("mongodb+srv://Rohit2002:20022003@cluster0.riuail2.mongodb.net/mock1?retryWrites=true&w=majority")

console.log("Connected to mongoose")
}catch(err){
    console.log(err)
}
}


app.get("/",(req,res)=>{
    res.send("welcome to homepage of the server")

})



app.use("/users",userRouter)
app.listen(8080,async()=>{
console.log("server is connecting")
await connection()
console.log("connected to backend")

})

