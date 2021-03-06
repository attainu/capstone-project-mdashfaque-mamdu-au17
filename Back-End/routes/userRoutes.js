const { Router } = require("express");
const userRoutes = Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

function Authenticate(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    next();
  } else {
    res.json({ error: true, message: "Not logged in!" });
  }
}

userRoutes.use(Authenticate);

userRoutes.post("/article/post", async (req, res) => {
  const { _id } = await Post.create(req.body);
  const postObj = await Post.findById(_id);
  await User.updateOne(
    { _id: req.user._id },
    { $push: { createdPosts: postObj._id } }
  );
  res.json(postObj);
});

userRoutes.post("/article/delete", async (req, res) => {
  try {
    let { post_id } = req.body;
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { createdPosts: post_id } }
    );
    await Post.deleteOne({ _id: post_id });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, errorObj: err });
  }
});

userRoutes.post("/article/like", async (req, res) => {
  try {
    let { post_id } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { likedPosts: post_id },
    });
    await Post.findByIdAndUpdate(post_id, { $inc: { likes: 1 } });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, errorObj: err });
  }
});

userRoutes.post("/article/removeLike", async (req, res) => {
  try {
    let { post_id } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { likedPosts: post_id },
    });
    await Post.findByIdAndUpdate(post_id, { $inc: { likes: -1 } });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, errorObj: err });
  }
});

userRoutes.post("/article/readingList/add", async (req, res) => {
  try {
    let { post_id } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { readingList: post_id },
    });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, errorObj: err });
  }
});

userRoutes.post("/article/readingList/remove", async (req, res) => {
  try {
    let { post_id } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { readingList: post_id },
    });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, errorObj: err });
  }
});

userRoutes.post("/follow", async (req, res) => {
  try {
    let follower_id = req.user._id;
    let followee_id = req.body.followee_id;
    await User.findByIdAndUpdate(follower_id, {
      $addToSet: { following: followee_id },
    });
    await User.findByIdAndUpdate(followee_id, {
      $addToSet: { followers: follower_id },
    });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, errorObj: err });
  }
});

userRoutes.post("/unfollow", async (req, res) => {
  try {
    let follower_id = req.user._id;
    let followee_id = req.body.followee_id;
    await User.findByIdAndUpdate(follower_id, {
      $pull: { following: followee_id },
    });
    await User.findByIdAndUpdate(followee_id, {
      $pull: { followers: follower_id },
    });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, errorObj: err });
  }
});

userRoutes.post("/comment/add", async (req, res) => {
  try {
    const { post_id, comment } = req.body;
    const commentObj = await Comment.create(comment);
    await Post.findByIdAndUpdate(post_id, {
      $push: { comments: commentObj._id },
    });
    res.json({ error: false, commentObj: commentObj });
  } catch (err) {
    res.json({ error: true, errorObj: err });
  }
});

userRoutes.post("/comment/remove", async (req, res) => {
  try {
    const { post_id, comment_id } = req.body;
    await Post.findByIdAndUpdate(post_id, {
      $pull: { comments: comment_id },
    });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, errorObj: err });
  }
});

module.exports = userRoutes;
