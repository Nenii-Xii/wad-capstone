const express = require("express");
const http    = require("http");
const { Server } = require("socket.io");
const helmet  = require("helmet");
const cors    = require("cors");
const { corsOptions } = require("./config/cors");
const { apiLimiter } = require("./config/rateLimiter");
const config  = require("./config");

const authRoutes  = require("./routes/auth.routes");
const tasksRoutes = require("./routes/tasks.routes");
const usersRoutes = require("./routes/users.routes");
const adminRoutes = require("./routes/admin.routes");

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.set("io", io);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(apiLimiter);

app.use("/auth",     authRoutes);
app.use("/api/v1",   tasksRoutes);
app.use("/api/v1",   usersRoutes);
app.use("/api/v1",   adminRoutes);

require("./socket")(io);

app.use((req, res) => res.status(404).json({ error: { code: "NOT_FOUND" } }));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ 
    error: { 
      code: err.code || "INTERNAL_ERROR", 
      message: err.message 
    } 
  });
});

server.listen(config.port, () => {
  console.log(`Server berjalan di http://localhost:${config.port}`);
  console.log(`Socket.IO siap`);
});