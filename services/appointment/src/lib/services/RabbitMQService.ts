import { IMessageQueueService } from './interfaces/IMessageQueueService';
import amqp from 'amqplib';
import { RABBITMQ_URL } from '@/config/config_url';
import logger from '@/config/logger';

export class RabbitMQService implements IMessageQueueService {
  private rabbitmqUrl: string;

  constructor(rabbitmqUrl?: string) {
    this.rabbitmqUrl = rabbitmqUrl || RABBITMQ_URL;
  }

  async publish(
    exchangeName: string,
    routingKey: string,
    message: string
  ): Promise<void> {
    let connection: amqp.Connection | null = null;
    try {
      connection = await amqp.connect(this.rabbitmqUrl);
      const channel = await connection.createChannel();
      await channel.assertExchange(exchangeName, 'direct', { durable: true });
      channel.publish(exchangeName, routingKey, Buffer.from(message));

      logger.info(
        `Message sent to exchange "${exchangeName}" with routing key "${routingKey}": ${message}`
      );

      // Mimicking the original behavior of closing connection after a short delay.
      setTimeout(() => {
        if (connection) {
          connection
            .close()
            .then(() =>
              logger.info('RabbitMQ connection closed after publish.')
            );
        }
      }, 500);
    } catch (error: any) {
      logger.error(
        `Error publishing message to exchange "${exchangeName}", routing key "${routingKey}":`,
        error.message
      );
      if (connection) {
        try {
          await connection.close();
          logger.info('RabbitMQ connection closed due to error.');
        } catch (closeError: any) {
          logger.error(
            'Error closing RabbitMQ connection during error handling:',
            closeError.message
          );
        }
      }
      throw error;
    }
  }
}
