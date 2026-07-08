const { LRUCache } = require("lru-cache");

const roomCache = new LRUCache({ max: 100, ttl: 1000 * 60 * 5 });
const messageCache = new LRUCache({ max: 50, ttl: 1000 * 60 * 2 });

function getRoom(key) {
  return roomCache.get(key);
}

function setRoom(key, value) {
  roomCache.set(key, value);
}

function invalidateRoom(key) {
  roomCache.delete(key);
}

function getMessages(key) {
  return messageCache.get(key);
}

function setMessages(key, value) {
  messageCache.set(key, value);
}

function invalidateMessages(key) {
  messageCache.delete(key);
}

module.exports = {
  getRoom,
  setRoom,
  invalidateRoom,
  getMessages,
  setMessages,
  invalidateMessages,
};
