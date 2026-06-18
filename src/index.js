// File: src/index.js
const express      = require('express');
const config       = require('./config');
const setupSwagger = require('./docs/swagger');
const authRoutes   = require('./routes/auth.routes');
const tasksRoutes  = require('./routes/tasks.routes');
const usersRoutes  = require('./routes/users.routes');
const authenticate = require('./middleware/authenticate');

const app = express();
app.use(express.json());

// Setup Swagger Documentation
setupSwagger(app);

// —— Auth routes (tidak dilindungi) ————————————————————————————————
app.use('/auth', authRoutes);

// —— API Routes yang dilindungi ————————————————————————————————————
// authenticate dijalankan sebelum semua rute /api/v1/...
app.use('/api/v1', authenticate);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/users', usersRoutes);

// —— Update error handler: tangani error dari authService ——————————
app.use((err, req, res, next) => {
  // Error dengan statusCode dari authService / rute manual
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: { code: err.code || 'AUTH_ERROR', message: err.message },
    });
  }

  // Prisma P2002: email duplikat (sudah ada user dengan email tersebut)
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: { code: 'DUPLICATE_RESOURCE', message: 'Data sudah digunakan.' },
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: { 
      code: 'INTERNAL_SERVER_ERROR', 
      message: config.env === 'development' ? err.message : 'Terjadi kesalahan di server.' 
    },
  });
});

app.listen(config.port, () => {
  console.log('-'.repeat(50));
  console.log(` ${config.appName || 'WAD Capstone API'} v${config.version || '1.0.0'}`);
  console.log(` Environment : ${config.env || 'development'}`);
  console.log(` Database    : MySQL via XAMPP`);
  console.log(` Server      : http://localhost:${config.port}`);
  console.log('-'.repeat(50));
});