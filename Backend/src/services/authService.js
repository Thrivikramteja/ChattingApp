const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");
const config = require("../config");

const signupSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

async function signup(data) {
  const parsed = signupSchema.parse(data);

  const existing = await User.findOne({ email: parsed.email });
  if (existing) {
    const err = new Error("User already exists");
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(parsed.password, 12);
  const user = await User.create({
    username: parsed.username,
    email: parsed.email,
    password: hashedPassword,
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(parsed.username)}`,
  });

  const token = generateToken(user);
  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  };
}

async function login(data) {
  const parsed = loginSchema.parse(data);

  const user = await User.findOne({ email: parsed.email });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(parsed.password, user.password);
  if (!valid) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const token = generateToken(user);
  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  };
}

module.exports = { signup, login, generateToken };
