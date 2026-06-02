// File: src/routes/index.js
const express = require('express');
const router = express.Router();
const { getHealth, getInfo, echo } = require('../controllers/healthController');

/**
 * @swagger
 * /health:
 * get:
 * summary: Cek kesehatan server Express
 * tags: [Sistem]
 * responses:
 * 200:
 * description: Server berjalan dengan sehat dan normal
 */
router.get('/health', getHealth);

/**
 * @swagger
 * /info:
 * get:
 * summary: Ambil informasi dasar aplikasi
 * tags: [Sistem]
 * responses:
 * 200:
 * description: Berhasil mengambil info aplikasi
 */
router.get('/info', getInfo);

/**
 * @swagger
 * /echo/{msg}:
 * get:
 * summary: Mengembalikan teks yang dikirimkan user (fitur echo)
 * tags: [Sistem]
 * parameters:
 * - in: path
 * name: msg
 * required: true
 * schema:
 * type: string
 * description: Pesan teks yang mau di-echo
 * responses:
 * 200:
 * description: Berhasil mengembalikan pesan
 */
router.get('/echo/:msg', echo);

module.exports = router;