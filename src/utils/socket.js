const socket = require("socket.io");
const Chat = require("../models/Chat");

const OnlineUsers = new Map();

const intializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? "https://dev-tinder-web-kk.vercel.app"
          : "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {

    socket.on("joinchat", ({ userId, id }) => {
      const room = [userId, id].sort().join("_");
      socket.join(room);
      OnlineUsers.set(userId, socket.id);
      io.emit("UserOnline", { userId });
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, toUserId, text }) => {
        const roomId = [userId, toUserId].sort().join("_");
        try {
          let chat = await Chat.findOne({
            participants: { $all: [userId, toUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, toUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            userId,
            toUserId,
            text,
          });
        } catch (err) {
          console.log(err.message);
        }
      }
    );

    socket.on("checkUserStatus", ({ userId }) => {
      const isOnline = OnlineUsers.has(userId);
      socket.emit("userStatus", { userId, online: isOnline });
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of OnlineUsers) {
        if (socketId === socket.id) {
          OnlineUsers.delete(userId);
          io.emit("UserOffline", { userId });
          break;
        }
      }
    });
  });
};

module.exports = intializeSocket;
