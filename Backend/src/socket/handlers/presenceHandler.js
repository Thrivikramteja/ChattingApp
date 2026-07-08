const logger = require("../../config/logger");

const typingUsers = new Map();
const onlineUsers = new Map();

function registerPresenceHandlers(io, socket) {
  onlineUsers.set(socket.user.userId, {
    userId: socket.user.userId,
    username: socket.user.username,
    socketId: socket.id,
  });

  io.emit("user_online", {
    userId: socket.user.userId,
    username: socket.user.username,
  });

  let typingTimeout;

  socket.on("typing_start", ({ roomId }) => {
    if (!roomId) return;

    if (!typingUsers.has(roomId)) {
      typingUsers.set(roomId, new Set());
    }
    typingUsers.get(roomId).add(socket.user.userId);

    socket.to(roomId).emit("typing_update", {
      roomId,
      typingUsers: Array.from(typingUsers.get(roomId)),
    });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("typing_stop", { roomId });
    }, 3000);
  });

  socket.on("typing_stop", ({ roomId }) => {
    if (!roomId) return;

    const roomTyping = typingUsers.get(roomId);
    if (roomTyping) {
      roomTyping.delete(socket.user.userId);
      if (roomTyping.size === 0) {
        typingUsers.delete(roomId);
      }
    }

    socket.to(roomId).emit("typing_update", {
      roomId,
      typingUsers: roomTyping ? Array.from(roomTyping) : [],
    });
  });

  socket.on("heartbeat", () => {
    onlineUsers.set(socket.user.userId, {
      userId: socket.user.userId,
      username: socket.user.username,
      socketId: socket.id,
      lastSeen: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.user.userId);
    logger.debug(`User disconnected: ${socket.user.username}`);

    io.emit("user_offline", {
      userId: socket.user.userId,
      username: socket.user.username,
    });

    for (const [roomId, users] of typingUsers.entries()) {
      if (users.has(socket.user.userId)) {
        users.delete(socket.user.userId);
        io.to(roomId).emit("typing_update", {
          roomId,
          typingUsers: Array.from(users),
        });
      }
    }

    clearTimeout(typingTimeout);
  });
}

function getOnlineUsers() {
  return Array.from(onlineUsers.values());
}

module.exports = { registerPresenceHandlers, getOnlineUsers };
