// File: src/index.js (Versi Sempurna Minggu 2)
const config = require('./config');
const express = require('express');
const routes = require('./routes');
const tasksRoutes = require('./routes/tasks.routes');
const setupSwagger = require('./docs/swagger');
const errorHandler = require('./middleware/errorHandler');
const usersRoutes = require('./routes/users.routes');

const app = express();

// ─── Middleware Global ───────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (Mencatat request masuk)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ─── Routes (Buku Menu) ───────────────────────────────────────
app.use('/', routes); // Akses langsung root (e.g. /health)
app.use('/api', routes); // Jalur lama: /api/info, /api/echo/:msg
app.use('/api/v1/tasks', tasksRoutes); // Jalur BARU: CRUD Tasks v1
app.use('/api/v1/users', usersRoutes); // Jalur BARU: CRUD Users v1

// ─── Swagger UI (Dokumentasi Otomatis) ───────────────────────
setupSwagger(app);

// ─── 404 Handler (Route Tidak Ketemu) ────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} tidak ditemukan.`,
      hint: 'Kunjungi GET /api/docs untuk melihat dokumentasi API resmi.',
    },
  });
});

// ─── Error Handler Global (Manajer Penanganan Masalah) ───────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: config.nodeEnv === 'development' ? err.message : 'Terjadi kesalahan di server.',
    },
  });
});

app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────
app.listen(config.port, () => {
  console.log('─'.repeat(50));
  console.log(` 🚀 ${config.appName} v${config.version}`);
  console.log(` 🌐 Environment : ${config.nodeEnv}`);
  console.log(` 📡 Server      : http://localhost:${config.port}`);
  console.log(` 📄 Docs        : http://localhost:${config.port}/api/docs`);
  console.log('─'.repeat(50));
});

module.exports = app;