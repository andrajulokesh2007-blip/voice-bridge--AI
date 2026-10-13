import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`💥 [Error] ${req.method} ${req.url}:`, err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Never expose internal secrets or stack traces in production
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
