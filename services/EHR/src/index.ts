import 'dotenv/config';
import http from 'http';
import app from '@/app';
import logger from '@/config/logger';

const server = http.createServer(app);

const port = process.env.PORT || 4002;
const serviceName = process.env.SERVICE_NAME || 'EHR-Service';

server.listen(port, () => {
  logger.info(`${serviceName} service is listening at http://ehr:${port}`);
});
