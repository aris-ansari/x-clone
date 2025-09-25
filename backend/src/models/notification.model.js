import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like", "comment"], // added comment support
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // useful for like/comment notifications
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // optional: if we want to link directly to a comment
    },
    read: {
      type: Boolean,
      default: false,
    },
    meta: {
      type: Object,
      default: {}, // optional extra info (e.g., "liked your photo", etc.)
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
