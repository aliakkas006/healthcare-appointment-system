import { format, transports } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import formatParams from '@/utils/formatParams';

// Elasticsearch transport
export const elasticSearchTrnasport = new ElasticsearchTransport({
  level: 'http',
  clientOpts: { node: 'http://elasticsearch:9200' },
  indexPrefix: 'log-appointment-service',
  indexSuffixPattern: 'YYYY-MM-DD',
});

// Development format
const devFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

// Console transport
export const consoleTransport = new transports.Console({
  level: 'info',
  format: devFormat,
});
