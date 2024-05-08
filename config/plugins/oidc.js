import axios from 'axios';
import qs from 'qs';

class Oidc {
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
    try {
      const headers = await kong.request.get_headers();
      const authHeader = headers['authorization'];
      const token = authHeader?.split(' ')[1].trim() || '';

      const { keycloak_introspection_url, client_id, client_secret } =
        this.config;

      kong.log.notice(`🍳🍳🍳🍳🍳
        token = ${token.length}
        keycloak_introspection_url = ${keycloak_introspection_url}
        client_id = ${client_id}
        client_secret = ${client_secret}  
        `);

      if (!token) {
        return await kong.response.exit(
          401,
          JSON.stringify({ message: 'Unauthorized. No token found!' })
        );
      }

      const data = qs.stringify({
        token,
        client_id,
        client_secret,
      });

      const response = await axios.post(keycloak_introspection_url, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      kong.log.notice(
        `🚆🚆🚆🚆🚆Kong Introspection API Response: ${JSON.stringify(
          response.data
        )}`
      );

      if (!response.data.actve) {
        return await kong.response.exit(
          401,
          JSON.stringify({ message: 'Unauthorized. Invalid Token!' })
        );
      }

      kong.log.notice(`🥰🥰 Request sent to the Upstream server`);

      // Set user data in the request header
      kong.service.request.set_header('x-user-id', response.data.sid);
      kong.service.request.set_header('x-user-email', response.data.email);

      return;
    } catch (err) {
      const message = err.message || 'Something went wrong';
      return await kong.response.exit(500, JSON.stringify({ message }));
    }
  }
}

export { Oidc };

export const Schema = [
  {
    keycloak_introspection_url: {
      type: 'string',
      required: true,
      description:
        "The URL of the external authentication server's validation endpoint.",
    },
  },
  {
    client_id: {
      type: 'string',
      required: true,
    },
  },
  {
    client_secret: {
      type: 'string',
      required: true,
    },
  },
];

export const Version = '1.0.0';
export const Priority = 0;
