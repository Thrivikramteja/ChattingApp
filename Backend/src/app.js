const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const config = require("./config");
const { connectDb } = require("./config/db");
const logger = require("./config/logger");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const messageRoutes = require("./routes/message");
const { initSocket } = require("./socket");

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

async function start() {
  try {
    await connectDb();
    initSocket(httpServer);

    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

start();

module.exports = app;
