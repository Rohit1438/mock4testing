const express=require("express")
const mongoose=require("mongoose")
const userRouter = require("./routes/userRouter")

const app=express()

app.use(express.json());

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

