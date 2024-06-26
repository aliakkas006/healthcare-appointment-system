import 'dotenv/config';
import http from 'http';
import app from './app';
import logger from '@/config/logger';

const server = http.createServer(app);

const port = process.env.PORT || 4006;
const serviceName = process.env.SERVICE_NAME || 'Email-Service';

server.listen(port, () => {
  logger.info(
    `${serviceName} service is listening at http://localhost:${port}`
  );
});
