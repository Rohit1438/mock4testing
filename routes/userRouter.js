const { Router } = require("express")
const User=require("../models/userModel")
const bcrypt=require("bcrypt")
 const userRouter=Router()

 userRouter.post("/register", async (req, res) => {
    console.log("coming in userroute");
    try {
      const { username, email, gender, password } = req.body;
      const user = await User.findOne({ email });
      const newPassword = await bcrypt.hash(password, 5);
      if (!user) {
        const newUser = await User.create({
          username,
          email,
          gender,
          password: newPassword,
        });
  
        res.status(200).json({ message: "Registration succesfull" });
      } else {
        console.log(" presendt");
        res.status(400).json({ message: "User is already registered" });
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
module.exports=userRouter