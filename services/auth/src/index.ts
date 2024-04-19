import 'dotenv/config';
import http from 'http';
import app from './app';

const server = http.createServer(app);

const port = process.env.PORT || 4003;
const serviceName = process.env.SERVICE_NAME || 'Auth-Service';

server.listen(port, () => {
  console.log(
    `${serviceName} service is listening at http://localhost:${port}`
  );
});
