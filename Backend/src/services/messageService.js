const Message = require("../models/Message");
const cacheService = require("./cacheService");

const DEFAULT_LIMIT = 30;

async function createMessage({ roomId, author, authorName, content }) {
  const message = await Message.create({
    roomId,
    author,
    authorName,
    content,
    status: "sent",
  });

  cacheService.invalidateMessages(roomId);
  return message;
}

async function getMessages(roomId, { cursor, limit = DEFAULT_LIMIT } = {}) {
  const cacheKey = `${roomId}:${cursor || "latest"}`;
  const cached = cacheService.getMessages(cacheKey);
  if (cached) return cached;

  const query = { roomId };

  if (cursor) {
    const cursorMessage = await Message.findById(cursor);
    if (cursorMessage) {
      query.createdAt = { $lt: cursorMessage.createdAt };
    }
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .populate("author", "username avatar");

  const hasMore = messages.length > limit;
  const results = hasMore ? messages.slice(0, limit) : messages;

  const response = {
    messages: results.reverse(),
    hasMore,
    nextCursor: hasMore ? results[0]._id : null,
  };

  cacheService.setMessages(cacheKey, response);
  return response;
}

async function updateMessageStatus(messageId, status) {
  const message = await Message.findByIdAndUpdate(
    messageId,
    { status },
    { new: true }
  );
  if (message) {
    cacheService.invalidateMessages(message.roomId);
  }
  return message;
}

async function markRoomMessagesRead(roomId, userId) {
  await Message.updateMany(
    {
      roomId,
      author: { $ne: userId },
      status: { $ne: "read" },
    },
    { status: "read" }
  );
  cacheService.invalidateMessages(roomId);
}

module.exports = {
  createMessage,
  getMessages,
  updateMessageStatus,
  markRoomMessagesRead,
};
