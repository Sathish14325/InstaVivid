import { setOnlineUsers } from "@/redux/chatSlice";
import { setLikeNotification } from "@/redux/notificationSlice";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const socketContext = createContext();

const useSocketContext = () => {
  return useContext(socketContext);
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socket = io(`${import.meta.env.VITE_APP_URI}`, {
        query: { userId: user?._id },
      });

      socket.on("connect", () => {
        console.log("Connected with socket ID:", socket.id);
        setSocket(socket);
      });

      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socket.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      return () => {
        if (socket && socket.connected) {
          socket.disconnect();
          setSocket(null);
        }
      };
    }
  }, [user, dispatch]);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};

export { SocketProvider, useSocketContext };
