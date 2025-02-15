import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!text && !img) {
      return res
        .status(400)
        .json({ success: false, message: "Post must have text or image" });
    }

    if (img) {
      const uploadedImg = await cloudinary.uploader.upload(img);
      img = uploadedImg.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Error in createPost controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const likeUnlinePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post ID" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      res
        .status(200)
        .json({ success: true, message: "Post unliked successfully" });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await notification.save();
      res
        .status(200)
        .json({ success: true, message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error in likeUnlinePost controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res
        .status(400)
        .json({ success: false, message: "Text field is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);

    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Error in commentOnPost controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id.toString());

    if (!post) {
      return res.status(404).json({ success: true, message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: true,
        message: "You are not authorized to delete this post",
      });
    }

    if (post.img) {
      await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error in getAllPosts controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: true, message: "User not found" });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json({ success: true, data: likedPosts });
  } catch (error) {
    console.error("Error in getLikedPosts controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: true, message: "User not found" });
    }

    const following = user.following;
    const followingPosts = await Post.find({
      user: { $in: following },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json({ success: true, data: followingPosts });
  } catch (error) {
    console.error("Error in getFollowingPosts controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userPosts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json({ success: true, data: userPosts });
  } catch (error) {
    console.error("Error in getUserPosts controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
