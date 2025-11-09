// Basic error handling middleware
module.exports = function errorHandler(err, req, res, next) {
  // Log error for debugging (replace with structured logger in prod)
  console.error(err && err.stack ? err.stack : err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Hide stack trace in production
  const payload = { message };
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};
