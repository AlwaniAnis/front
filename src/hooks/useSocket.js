import { baseURL } from "@/config/api";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(userId, roles, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(baseURL, {
      query: {
        userId: userId,
        roles: roles.join(","),
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.on("statusUpdate", (message) => {
      console.log("Received status update:", message);
      if (onMessage) onMessage(message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, roles, onMessage]);

  return socketRef;
}
