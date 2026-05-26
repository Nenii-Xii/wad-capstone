// File: src/index.js

// 1. Muat konfigurasi dan jalur (routes) yang sudah kita buat tadi
const config  = require('./config');
const express = require('express');
const routes  = require('./routes');

// --- Inisialisasi Express App ----------------------------------------
const app = express(); // Membangun kerangka restoran (aplikasi)

// --- Middleware Global (Satpam Pemeriksa) ----------------------------
// Memastikan aplikasi bisa membaca data berformat JSON
app.use(express.json());

// Memastikan aplikasi bisa membaca data dari form (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Mencatat setiap pengunjung yang datang (Logging sederhana)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
  });
  next(); // Lanjut ke proses berikutnya
});

// --- Routes (Membuka Buku Menu) --------------------------------------
// Route untuk mengecek kesehatan server (langsung di root)
app.use('/', routes);

// Route untuk fitur utama dengan awalan /api
app.use('/api', routes);

// --- 404 Handler (Menu Tidak Ditemukan) ------------------------------
// Menangkap pengunjung yang mencari URL aneh-aneh
app.use((req, res) => {
  res.status(404).json({
    error:   'Not Found',
    message: `Route ${req.method} ${req.path} tidak ditemukan.`,
    hint:    'Kunjungi GET /api/info untuk melihat daftar endpoint yang tersedia.',
  });
});

// --- Error Handler Global (Manajer Penanganan Masalah) ---------------
// Kalau ada kode yang rusak/error, larinya ke sini (Kode 500)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    error:   'Internal Server Error',
    // Cuma kasih tahu detail error kalau kita lagi mode 'development' (nge-build)
    message: config.nodeEnv === 'development' ? err.message : 'Terjadi kesalahan di server.',
  });
});

// --- Start Server (Buka Restoran!) -----------------------------------
app.listen(config.port, () => {
  console.log('-'.repeat(50));
  console.log(` ${config.appName} v${config.version}`);
  console.log(` Environment : ${config.nodeEnv}`);
  console.log(` Server      : http://localhost:${config.port}`);
  console.log('-'.repeat(50));
});

module.exports = app; // Diekspor agar nanti bisa di-testing