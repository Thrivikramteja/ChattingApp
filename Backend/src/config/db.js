const mongoose = require("mongoose");
const config = require("./index");

async function connectDb() {
  await mongoose.connect(config.mongoUri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
  });
  console.log("Database connected successfully!");
}

module.exports = { connectDb };
