const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const chatSocket = require("./sockets/chatSocket");
const socketAuth = require("./utils/socketAuth");
const User = require("./models/User");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Simple in-memory cache
const cache = new Map();
const cacheMiddleware = (duration = 60000) => {
  return (req, res, next) => {
    const key = `${req.method}:${req.originalUrl}`;
    const cachedData = cache.get(key);
    
    if (cachedData && Date.now() - cachedData.timestamp < duration) {
      return res.json(cachedData.data);
    }
    
    const originalJson = res.json;
    res.json = function (data) {
      cache.set(key, { data, timestamp: Date.now() });
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/* ---------- DATABASE ---------- */
connectDB();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", cacheMiddleware(30000), userRoutes); // Cache for 30s
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.send("Server is running");
});

/* ---------- SOCKET.IO ---------- */
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// online users map (kept as-is)
const onlineUsers = new Map();

io.on("connection", async (socket) => {
  const userId = socketAuth(socket);

  if (!userId) {
    socket.disconnect();
    return;
  }

  socket.userId = userId;
  onlineUsers.set(userId, socket.id);

  await User.findByIdAndUpdate(userId, { isOnline: true });
  socket.broadcast.emit("user_online", userId);

  console.log("User connected:", userId);

  // attach chat socket handlers
  chatSocket(io, socket);

  socket.on("disconnect", async () => {
    onlineUsers.delete(userId);

    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: new Date(),
    });

    socket.broadcast.emit("user_offline", userId);
    console.log("User disconnected:", userId);
  });
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
