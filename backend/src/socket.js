import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io = null;
export const onlineUsers = new Map();

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true, // important for cookie auth
    },
  });

  // Authenticate socket handshake using JWT cookie
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next(new Error("No cookie found"));

      const token = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("jwt="))
        ?.split("=")[1];

      if (!token) return next(new Error("No token found"));

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.userId;

      next();
    } catch (error) {
      console.log("Socket auth failed:", error.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = String(socket.userId);

    // Join a room named by userId
    socket.join(userId);

    // Track socket IDs for multiple tabs/devices
    const set = onlineUsers.get(userId) || new Set();
    set.add(socket.id);
    onlineUsers.set(userId, set);

    console.log(`Socket connected: user=${userId} socket=${socket.id}`);

    socket.on("disconnect", () => {
      const s = onlineUsers.get(userId);
      if (s) {
        s.delete(socket.id);
        if (s.size === 0) onlineUsers.delete(userId);
        else onlineUsers.set(userId, s);
      }
      console.log(`Socket disconnected: user=${userId} socket=${socket.id}`);
    });

    // Example custom event
    socket.on("markNotificationRead", ({ notificationId }) => {
      console.log("Mark read:", notificationId);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
