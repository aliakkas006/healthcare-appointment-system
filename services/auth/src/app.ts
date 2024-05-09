import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from '@/routes';
import logger from '@/config/logger';
import setCorrelationId from '@/config/setCorrelationId';
import expressWinstonLogger from '@/config/expressWinstonLogger';

const app = express();

app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  setCorrelationId,
  expressWinstonLogger('http'),
  cors(),
  morgan('dev'),
]);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Routes
app.use(routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const errObj = {
    status: err?.status || 500,
    message: err?.message || 'Something went wrong!',
    errors: err?.errors || [],
    correlationId: req.headers['x-correlation-id'],
  };

  logger.error(JSON.stringify(errObj));
  res.status(errObj.status).json(errObj);
});

export default app;
