import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { registerUser, loginUser, getMe } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('gigflow_access', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: env.nodeEnv === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  setAuthCookie(res, result.token);
  sendSuccess(res, result, 'Registration successful', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  setAuthCookie(res, result.token);
  sendSuccess(res, result, 'Login successful');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) throw new AppError('Not authenticated', 401);
  const user = await getMe(authReq.user.userId);
  sendSuccess(res, user);
});
