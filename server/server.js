const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();
require("./config/mongodb").connect();
require("./config/instrument");
const Sentry = require("@sentry/node");

app.use(express.json());
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
  })
);

const io = new Server(server, {
  cors: ["*"],
});

const User = require("./models/user.model");
io.use((socket, next) => {
  const user_id = socket.handshake.query.id;
  if (!user_id) {
    return next(new Error("user_id is required"));
  }

  socket.user_id = user_id;
  next();
});

io.on("connection", async (socket) => {
  try {
    console.log(`Socket.id: ${socket.id} connected`);

    const user = await User.findById(socket.user_id);

    if (!user) {
      console.error(`User with id ${socket.user_id} not found.`);
      socket.disconnect();
      return;
    }

    user.socketId = socket.id;
    await user.save();

    console.log("User has_logged_in status:", user.has_logged_in);
    if (!user.has_logged_in) {
      user.notifications = [{ message: "Welcome to dashboard" }];
      user.has_logged_in = true;
      await user.save();
      io.to(user.socketId).emit("new-notification", {
        message: user.notifications[0],
      });
    }

    socket.on("new-notification", async (data) => {
      const { targetId, message } = data;

      try {
        const target = await User.findById(targetId);

        if (target) {
          // Tambahkan notifikasi ke array notifications user
          target.notifications.push({ message });
          await target.save();

          // Kirim notifikasi ke target user via socket
          io.to(target.socketId).emit("new-notification", {
            message,
          });
        } else {
          console.error(`Target user with id ${targetId} not found.`);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  } catch (error) {
    console.error("Error during connection setup:", error);
  }
});

const AUTH_ROUTES = require("./routes/auth.route");
const USER_ROUTES = require("./routes/user.route");
app.use("/auth", AUTH_ROUTES);
app.use("/user", USER_ROUTES);

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
