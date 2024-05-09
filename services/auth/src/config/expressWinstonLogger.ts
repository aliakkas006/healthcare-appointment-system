import expressWinston from 'express-winston';
import logger from '@/config/logger';

const expressWinstonLogger = (level: any) => {
  return expressWinston.logger({
    level: level || 'info',
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.responseTime}}',
    expressFormat: true,
    colorize: false,
  });
};

export default expressWinstonLogger;
