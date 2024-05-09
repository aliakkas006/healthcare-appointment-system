export const RABBITMQ_URL =
  process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';

export const REDIS_PORT = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT)
  : 6379;

export const REDIS_HOST = process.env.REDIS_HOST || 'redis-stack';
