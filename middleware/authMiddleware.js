const jwt = require("jsonwebtoken");
require("dotenv").config();
const { BlacklistModel } = require("../models/blacklistmodel");

const auth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    let existingToken = await BlacklistModel.find({
      blacklist: { $in: token },
    });
    if (existingToken) {
      res.status(200).json("Login!!");
    } else {
      const decoded = jwt.verify(token, process.env.SECRETPASSWD);
      req.body.userID = decoded.userID;
      next();
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { auth };
