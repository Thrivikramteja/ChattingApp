require("dotenv").config();

const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const db = require("./database");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with Id: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(5000, () => {
  console.log("Server listening on port 5000");
});

app.use(cors());

app.use(express.json());

app.post("/signup", async function (req, res) {
  const userData = req.body;
  const userName = userData.username;
  const email = userData.email;
  const password = userData.password;

  if (
    !email ||
    !password ||
    password.trim() < 6 ||
    !email.includes("@")
  ) {
    return res.status(400).json({ message: "Incorrect input" });
  }

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: email });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = {
    userName: userName,
    email: email,
    password: hashedPassword,
  };

  await db.getDb().collection("users").insertOne(user);
  return res.status(200).json({ valid: true });
});

app.post("/login", async function (req, res, next) {
  const userData = req.body;
  const email = userData.email;
  const password = userData.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: email });

  if (!existingUser) {
    return res.status(401).json({ message: "User does'nt exist!" });
  }

  const passwordsAreEqual = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!passwordsAreEqual) {
    return res.status(401).json({ message: "Incorrect password!" });
  }

  const user = { name: existingUser.username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  res.json(accessToken);
});

app.post("/roomid", async function (req, res) {
  const roomData = req.body;

  const existingRoom = await db
    .getDb()
    .collection("rooms")
    .findOne({ roomId: roomData.roomId });

  if (existingRoom) {
    res.status(400).json({ message: "Room already exists!" });
  } else {
    await db.getDb().collection("rooms").insertOne({
      roomName: roomData.roomName,
      roomId: roomData.roomId,
      username: roomData.username,
    });
    res.json({ message: "Room Created!" });
  }
});

app.post("/roomExists", async function (req, res) {
  const { roomId } = req.body;

  const existingRoom = await db
    .getDb()
    .collection("rooms")
    .findOne({ roomId: roomId });

  if (!existingRoom) {
    return res.status(404).json({ message: "Room does not exist" });
  }

  return res.json({ roomName: existingRoom.roomName });
});

app.post("/storeUser", async function (req, res) {
  const { username, roomId, id } = req.body;

  const user = await db
    .getDb()
    .collection("users")
    .findOne({ _id: new ObjectId(id) });

  if (user) {
    return res
      .status(200)
      .json({ username: user.username, id: user.insertedId });
  }

  await db
    .getDb()
    .collection("users")
    .insertOne({ roomId: roomId, username: username });

  return res.status(201).json({ id: user.insertedId });
});

app.post("/logout", function (req, res) {});

db.initDb()
  .then(function () {
    console.log("Database connected successfully!");
    app.listen(8000, () => {
      console.log("Server Started on port: 8000");
    });
  })
  .catch(function (error) {
    console.log(error);
    console.log("Connecting to the database failed!");
  });
