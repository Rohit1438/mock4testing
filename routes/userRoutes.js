const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");
const { BlacklistModel } = require("../models/blacklistmodel");
require("dotenv").config();
const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await userModel.findOne({ email }); //? checking if the user existed with same email
    if (user) {
      res.status(400).json({ message: "Already existing user" });
    } else {
      bcrypt.hash(req.body.password, 14, async (error, hash) => {
        if (hash) {
          const newUser = new userModel({
            ...req.body,
            password: hash,
          });
          await newUser.save();
          res.status(400).json({ message: "Registered" });
        }
      });
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body; //? desctructuring the userSchema

  try {
    const user = await userModel.findOne({ email }); //? finding the username
    if (user) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          var token = jwt.sign({ userId: user._id }, process.env.SECRETPASSWD);
          res.status(200).json({ msg: "User Logged in" }, token);
        } else {
          res.status(200).json({ msg: "Incorrect Password" });
        }
      });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

userRouter.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || null;
    if (token) {
      await BlacklistModel.updateMany({}, { $push: { blacklist: [token] } });
      res.status(200).send("Logged Out!");
    }
  } catch (error) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.exports = { userRouter };
