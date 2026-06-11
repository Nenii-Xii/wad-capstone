const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const errCode = err.code || 'INTERNAL_SERVER_ERROR';

  return res.status(statusCode).json({
    status: 'error',
    error: {
      code: errCode,
      message: err.message || 'Terjadi kesalahan pada internal server.',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;