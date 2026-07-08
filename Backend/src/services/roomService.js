const { z } = require("zod");
const Room = require("../models/Room");
const cacheService = require("./cacheService");

const createRoomSchema = z.object({
  roomName: z.string().min(1).max(100),
  roomId: z.string().min(1).max(50),
});

async function createRoom(data, userId) {
  const parsed = createRoomSchema.parse(data);

  const existing = await Room.findOne({ roomId: parsed.roomId });
  if (existing) {
    const err = new Error("Room already exists");
    err.status = 409;
    throw err;
  }

  const room = await Room.create({
    roomId: parsed.roomId,
    roomName: parsed.roomName,
    createdBy: userId,
    members: [userId],
    unreadCounts: new Map(),
  });

  cacheService.setRoom(parsed.roomId, room);
  return room;
}

async function getRoomByRoomId(roomId) {
  const cached = cacheService.getRoom(roomId);
  if (cached) return cached;

  const room = await Room.findOne({ roomId });
  if (room) {
    cacheService.setRoom(roomId, room);
  }
  return room;
}

async function getUserRooms(userId) {
  return Room.find({ members: userId })
    .sort({ updatedAt: -1 })
    .populate("createdBy", "username avatar");
}

async function joinRoom(roomId, userId) {
  const room = await getRoomByRoomId(roomId);
  if (!room) {
    const err = new Error("Room does not exist");
    err.status = 404;
    throw err;
  }

  if (!room.members.some((m) => m.toString() === userId.toString())) {
    room.members.push(userId);
    await room.save();
    cacheService.invalidateRoom(roomId);
  }

  return room;
}

async function incrementUnread(roomId, excludeUserId) {
  const room = await Room.findOne({ roomId });
  if (!room) return;

  for (const memberId of room.members) {
    if (memberId.toString() !== excludeUserId.toString()) {
      const key = memberId.toString();
      const current = room.unreadCounts.get(key) || 0;
      room.unreadCounts.set(key, current + 1);
    }
  }
  await room.save();
  cacheService.invalidateRoom(roomId);
}

async function resetUnread(roomId, userId) {
  const room = await Room.findOne({ roomId });
  if (!room) return;

  room.unreadCounts.set(userId.toString(), 0);
  await room.save();
  cacheService.invalidateRoom(roomId);
}

module.exports = {
  createRoom,
  getRoomByRoomId,
  getUserRooms,
  joinRoom,
  incrementUnread,
  resetUnread,
};
