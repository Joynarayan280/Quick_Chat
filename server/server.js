import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import dns from "dns"; // 💡 Added DNS module
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRouters.js";
import { Server } from "socket.io";

// 💡 Fix for querySrv ENOTFOUND (Forces Node.js to use IPv4 DNS resolution)
dns.setDefaultResultOrder("ipv4first");

const app = express();
const server = http.createServer(app);

// Initialize socket.io
export const io = new Server(server, {
    cors: { origin: "*" }
});

// Store online User
export const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    if (userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        // Only remove this user if the disconnecting socket is still the
        // one on record — an old/stale socket disconnecting late should
        // not wipe out a newer reconnection for the same user.
        if (userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res) => res.send("server is live ✅"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// DB connect
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));