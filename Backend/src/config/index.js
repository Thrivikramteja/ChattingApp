require("dotenv").config();

const config = {
  port: parseInt(process.env.PORT, 10) || 8000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/ChatApp",
  jwtSecret: process.env.ACCESS_TOKEN_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  nodeEnv: process.env.NODE_ENV || "development",
};

if (!config.jwtSecret) {
  throw new Error("ACCESS_TOKEN_SECRET environment variable is required");
}

module.exports = config;
