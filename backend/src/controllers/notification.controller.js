import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "userName profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error in getNotifications controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res
      .status(200)
      .json({ success: true, message: "Notifications deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotifications controller", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
