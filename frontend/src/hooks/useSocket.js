import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useNotifications } from "../components/context/NotificationContext";
import toast from "react-hot-toast";

const useSocket = () => {
  const socketRef = useRef(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:8000", {
      transports: ["websocket"],
      withCredentials: true, // send JWT cookie
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("notification", (payload) => {
      console.log("Realtime notification:", payload);
      addNotification(payload);
      toast(`${payload.meta?.fullName} ${payload.meta?.message || payload.type}`);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [addNotification]);

  return socketRef;
}

export default useSocket;