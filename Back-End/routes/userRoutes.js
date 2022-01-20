const { Router } = require("express");
const userRoutes = Router();
const Post = require("../models/Post");
const User = require("../models/User");

userRoutes.post("/article/post", async (req, res) => {
  if (req.isAuthenticated()) {
    const postObj = await Post.create(req.body);
    await User.updateOne(
      { _id: postObj.author },
      { $push: { createdPosts: postObj._id } }
    );
    res.json(postObj);
  } else {
    res.json("Not logged in!");
  }
});

userRoutes.post("/article/delete", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      let { post_id, user_id } = req.body;
      await Post.deleteOne({ _id: post_id });
      await User.updateOne(
        { _id: user_id },
        { $pull: { createdPosts: post_id } }
      );
      res.json({ error: false });
    } catch (err) {
      res.json({ error: true, errorObj: err });
    }
  } else {
    res.json("Not logged in!");
  }
});

module.exports = userRoutes;
