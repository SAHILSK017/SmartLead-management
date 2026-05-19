import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import router from './routes';
import { errorHandler } from './middleware/error.middleware';
import {
  csrfProtection,
  helmetOptions,
  issueCsrfToken,
  sanitizeInput,
} from './middleware/security.middleware';

const app = express();

// Security middleware
app.use(helmet(helmetOptions));
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);

// Request parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);
app.use(issueCsrfToken);
app.use(csrfProtection);

// Logging (only in development)
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Smart Leads API is running' });
});

// API routes
app.use('/api', router);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;
