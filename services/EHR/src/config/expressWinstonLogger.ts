import expressWinston from 'express-winston';
import logger from '@/config/logger';

const expressWinstonLogger = (level = 'http') => {
  return expressWinston.logger({
    level,
    winstonInstance: logger,
    meta: true,
    msg: `HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}`,
    expressFormat: true,
    colorize: true,
  });
};

export default expressWinstonLogger;
