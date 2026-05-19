import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { HttpStatus } from '../constants/http';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongoose duplicate key
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError') {
    const mongoErr = err as { code?: number; keyValue?: Record<string, unknown> };
    if (mongoErr.code === 11000) {
      const field = Object.keys(mongoErr.keyValue ?? {})[0] ?? 'field';
      res.status(HttpStatus.CONFLICT).json({
        success: false,
        message: `${field} already exists`,
      });
      return;
    }
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid ID format' });
    return;
  }

  // Unknown errors
  if (env.nodeEnv === 'development') {
    console.error('Unhandled error:', err);
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
  });
};
