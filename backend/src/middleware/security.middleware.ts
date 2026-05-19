import { NextFunction, Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_AUTH_ATTEMPTS = 20;
const csrfCookieName = 'smartleads_csrf';
const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const authWritePaths = new Set(['/api/auth/login', '/api/auth/register']);

const attempts = new Map<string, { count: number; resetAt: number }>();

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return value.replace(/\0/g, '').trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        sanitizeValue(entry),
      ])
    );
  }

  return value;
};

export const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce<Record<string, string>>((cookies, item) => {
    const [rawName, ...rawValue] = item.trim().split('=');
    if (!rawName) return cookies;
    cookies[decodeURIComponent(rawName)] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
};

export const sanitizeInput = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query) as Request['query'];
  req.params = sanitizeValue(req.params) as Request['params'];
  next();
};

export const authRateLimit = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || record.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_AUTH_ATTEMPTS) {
    return next(new AppError('Too many attempts. Please try again later.', 429));
  }

  record.count += 1;
  attempts.set(key, record);
  next();
};

export const issueCsrfToken = (_req: Request, res: Response, next: NextFunction): void => {
  const token = randomBytes(32).toString('hex');

  res.cookie(csrfCookieName, token, {
    httpOnly: false,
    sameSite: 'strict',
    secure: env.nodeEnv === 'production',
    maxAge: 60 * 60 * 1000,
    path: '/',
  });

  res.locals.csrfToken = token;
  next();
};

export const csrfProtection = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!unsafeMethods.has(req.method) || authWritePaths.has(req.path)) {
    return next();
  }

  const cookies = parseCookies(req.headers.cookie);
  const cookieToken = cookies[csrfCookieName];
  const headerToken = req.header('x-csrf-token');

  if (cookieToken && headerToken !== cookieToken) {
    return next(new AppError('Invalid CSRF token', 403));
  }

  next();
};

export const helmetOptions = {
  contentSecurityPolicy: env.nodeEnv === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'no-referrer' as const },
};
