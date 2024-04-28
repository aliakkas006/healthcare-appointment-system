import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import notificationService from '@/lib';

const app = express();

app.use([express.json(), cors(), morgan('dev')]);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Handle incoming notifications
// notificationService.handleNotification((notification) => {
//   notificationService.processNotification(notification);
// });

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
