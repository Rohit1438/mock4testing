const express = require("express");
const { Router } = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { PostModel } = require("../models/postModel");
const jwt = require("jsonwebtoken");

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const { pageNo, limit, minCmt, maxCmt, div1, div2 } = req.query;

  const skip = (pageNo - 1) * limit;
  const { userId } = req.body;
  const query = {};
  if (userId) {
    query.userId = userId;
  }
  if (minCmt && maxCmt) {
    query.No_comments = {
      $and: [
        { No_comments: { $gt: minCmt } },
        { No_comments: { $lt: maxCmt } },
      ],
    };
  }
  if (div1 && div2) {
    query.device = { $and: [{ device: div1 }, { device: div2 }] };
  } else if (div1) {
    query.device = div1;
  }

  try {
    const posts = await PostModel.find(query)
      .sort({ No_comments: 1 }) //? ascending
      .skip(skip)
      .limit(limit);
    res.status(200).json({ msg: "Posts", posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.get("/toppost", async (req, res) => {
  const { pageNo } = req.query;
  const limit = 5;
  const skip = (pageNo - 1) * limit;

  try {
    const postsTop = await PostModel.findOne()
      .sort({ No_comments: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({ msg: "Posts", postsTop });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.post("/add", async (req, res) => {
  const { userId } = req.body;
  try {
    const post = new PostModel({ ...req.body, userId });
    await post.save();
    res.status(200).json({ msg: "Post added" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.patch("/update/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const post = await PostModel.findByIdAndUpdate(
      {
        userId,
        _id: postId,
      },
      req.body
    );
    if (!post) {
      res.status(400).json({ msg: "Not found" });
    } else {
      res.status(200).json({ msg: "Post updated" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.delete("/delete/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const post = await PostModel.findByIdAndDelete(
      {
        userId,
        _id: postId,
      },
      req.body
    );
    if (!post) {
      res.status(400).json({ msg: "Not found" });
    } else {
      res.status(200).json({ msg: "Post deleted" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { postRouter };
