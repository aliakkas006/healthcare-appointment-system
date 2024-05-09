import { createLogger } from 'winston';
import 'winston-daily-rotate-file';
import { consoleTransport, elasticSearchTrnasport } from '@/utils/transports';

const logger = createLogger({
  transports: [elasticSearchTrnasport, consoleTransport],
});

export default logger;
