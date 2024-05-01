import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { configureRoutes } from '@/utils';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (_req, res) => {
    res
      .status(429)
      .json({ message: 'Too many requests, please try again later.' });
  },
});

app.use('/api/v1', limiter);

app.use([express.json(), cors(), morgan('dev')]);

// Routes
configureRoutes(app);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'API Gateway is running!' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
