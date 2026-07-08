const messageService = require("../services/messageService");
const roomService = require("../services/roomService");

async function getMessages(req, res, next) {
  try {
    const { cursor, limit } = req.query;
    const result = await messageService.getMessages(req.params.roomId, {
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    await messageService.markRoomMessagesRead(req.params.roomId, req.user._id);
    await roomService.resetUnread(req.params.roomId, req.user._id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMessages, markRead };
