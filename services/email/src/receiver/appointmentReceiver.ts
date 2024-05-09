import amqp from 'amqplib';
import { RABBITMQ_URL } from '@/config/config_url';
import emailService from '@/libs/EmailService';
import logger from '@/config/logger';

const appointmentReceiver = async (
  queue: string,
  callback: (message: string) => void
) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchange = 'appointment';
    await channel.assertExchange(exchange, 'direct', { durable: true });

    const q = await channel.assertQueue(queue, { durable: true });
    channel.bindQueue(q.queue, exchange, queue);

    channel.consume(
      q.queue,
      (msg) => {
        if (msg) {
          callback(msg.content.toString());
        }
      },
      { noAck: true }
    );
  } catch (err) {
    logger.error('Error occurred while consuming messages from queue:', err);
  }
};

appointmentReceiver('send-email', async (msg) => {
  try {
    const parsedBody = JSON.parse(msg);
    await emailService.processEmailAppointment(parsedBody);
  } catch (error) {
    logger.error('Error processing message:', error);
  }
});
