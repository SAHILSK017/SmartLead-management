import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest, JwtPayload } from '../types';
import { AppError } from '../utils/AppError';
import { parseCookies } from './security.middleware';

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const cookies = parseCookies(req.headers.cookie);
  const cookieToken = cookies['gigflow_access'];

  if ((!authHeader || !authHeader.startsWith('Bearer ')) && !cookieToken) {
    return next(new AppError('No token provided. Please log in.', 401));
  }

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : cookieToken;

  if (!token) {
    return next(new AppError('No token provided. Please log in.', 401));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch {
    next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
};
