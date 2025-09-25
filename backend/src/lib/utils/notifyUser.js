import Notification from "../../models/notification.model.js";
import { getIO } from "../../socket.js";

export async function notifyUser({ from, to, type, post = null, comment = null, meta = {} }) {
  if (String(from) === String(to)) return null; // don't notify yourself

  // Save in DB
  const notification = await Notification.create({
    from,
    to,
    type,
    post,
    comment,
    meta,
  });

  // Emit in real time (if user online)
  const io = getIO();
  io.to(String(to)).emit("notification", {
    id: notification._id,
    type: notification.type,
    from,
    post,
    comment,
    createdAt: notification.createdAt,
    meta,
  });

  return notification;
}
