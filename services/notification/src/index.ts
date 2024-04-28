import 'dotenv/config';
import http from 'http';
import app from './app';

const server = http.createServer(app);

const port = process.env.PORT || 4005;
const serviceName = process.env.SERVICE_NAME || 'Notification-Service';

server.listen(port, () => {
  console.log(
    `${serviceName} service is listening at http://localhost:${port}`
  );
});
