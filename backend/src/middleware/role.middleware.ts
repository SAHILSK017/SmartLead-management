import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { AppError } from '../utils/AppError';

export const requireRole =
  (...roles: UserRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
