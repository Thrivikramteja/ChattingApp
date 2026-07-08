const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const config = require("../config");
const logger = require("../config/logger");
const { registerChatHandlers } = require("./handlers/chatHandler");
const { registerPresenceHandlers } = require("./handlers/presenceHandler");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigin,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    logger.debug(`User connected: ${socket.user.username} (${socket.id})`);

    registerChatHandlers(io, socket);
    registerPresenceHandlers(io, socket);

    socket.on("reconnect_pending_messages", async ({ roomId }) => {
      socket.join(roomId);
    });
  });

  return io;
}

module.exports = { initSocket };
