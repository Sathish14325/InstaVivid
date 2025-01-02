import dotenv from "dotenv";
import { Server } from "socket.io";
import express from "express";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*", // Fallback to "*" for development
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.error("Connection attempted without userId");
    socket.disconnect();
    return;
  }

  userSocketMap[userId] = socket.id;
  // console.log(`User connected: UserId = ${userId}, SocketId = ${socket.id}`);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(
        `User disconnected: UserId = ${userId}, SocketId = ${socket.id}`
      );
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
