import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getUserProfile = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName }).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You can't follow or unfollow yourself",
      });
    }

    if (!userToModify || !currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      const newNotification = new Notification({
        from: userToModify._id,
        to: req.user._id,
        type: "follow",
      });

      await newNotification.save();

      const toUnfollow = `You have unfollowed ${userToModify.fullName}`;

      res.status(200).json({ success: true, message: toUnfollow });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        from: req.user._id,
        to: userToModify._id,
        type: "follow",
      });

      await newNotification.save();

      const toFollow = `You have started following ${userToModify.fullName}`;

      res.status(200).json({ success: true, message: toFollow });
    }
  } catch (error) {
    console.error("Error in followUnfollowUser controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const myFollowingList = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !myFollowingList.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    // suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json({ success: true, data: suggestedUsers });
  } catch (error) {
    console.error("Error in suggestedUsers controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateUser = async (req, res) => {
  const { userName, fullName, email, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isCurrentPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Your current password is incorrect",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
      console.log("uploadedResponse:", uploadedResponse);
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.userName = userName || user.userName;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null;

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in updateUser controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
