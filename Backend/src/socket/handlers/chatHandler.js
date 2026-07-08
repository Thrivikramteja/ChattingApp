const messageService = require("../../services/messageService");
const roomService = require("../../services/roomService");
const logger = require("../../config/logger");

function registerChatHandlers(io, socket) {
  socket.on("join_room", async (roomId) => {
    try {
      socket.join(roomId);
      socket.currentRoom = roomId;
      logger.debug(`User ${socket.user.username} joined room: ${roomId}`);

      await roomService.joinRoom(roomId, socket.user.userId);
      await roomService.resetUnread(roomId, socket.user.userId);
      await messageService.markRoomMessagesRead(roomId, socket.user.userId);

      socket.to(roomId).emit("user_joined", {
        userId: socket.user.userId,
        username: socket.user.username,
      });
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    if (socket.currentRoom === roomId) {
      socket.currentRoom = null;
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { roomId, content } = data;
      if (!roomId || !content?.trim()) return;

      const message = await messageService.createMessage({
        roomId,
        author: socket.user.userId,
        authorName: socket.user.username,
        content: content.trim(),
      });

      await roomService.incrementUnread(roomId, socket.user.userId);

      const payload = {
        _id: message._id,
        roomId: message.roomId,
        author: socket.user.userId,
        authorName: message.authorName,
        content: message.content,
        status: message.status,
        createdAt: message.createdAt,
      };

      io.to(roomId).emit("receive_message", payload);

      socket.to(roomId).emit("message_delivered", { messageId: message._id });
    } catch (err) {
      logger.error(`Send message error: ${err.message}`);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("message_read", async ({ roomId, messageId }) => {
    try {
      await messageService.updateMessageStatus(messageId, "read");
      socket.to(roomId).emit("message_status_update", {
        messageId,
        status: "read",
      });
    } catch (err) {
      logger.error(`Message read error: ${err.message}`);
    }
  });
}

module.exports = { registerChatHandlers };
