const roomService = require("../services/roomService");

async function createRoom(req, res, next) {
  try {
    const room = await roomService.createRoom(req.body, req.user._id);
    res.status(201).json({
      room: {
        roomId: room.roomId,
        roomName: room.roomName,
        createdBy: room.createdBy,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getRoom(req, res, next) {
  try {
    const room = await roomService.getRoomByRoomId(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: "Room does not exist" });
    }
    res.json({
      room: {
        roomId: room.roomId,
        roomName: room.roomName,
        unreadCount: room.unreadCounts.get(req.user._id.toString()) || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function listRooms(req, res, next) {
  try {
    const rooms = await roomService.getUserRooms(req.user._id);
    res.json({
      rooms: rooms.map((room) => ({
        roomId: room.roomId,
        roomName: room.roomName,
        unreadCount: room.unreadCounts.get(req.user._id.toString()) || 0,
        updatedAt: room.updatedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

async function joinRoom(req, res, next) {
  try {
    const room = await roomService.joinRoom(req.params.roomId, req.user._id);
    res.json({
      room: {
        roomId: room.roomId,
        roomName: room.roomName,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createRoom, getRoom, listRooms, joinRoom };
