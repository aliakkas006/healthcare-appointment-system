import amqp from 'amqplib';
import { RABBITMQ_URL } from '@/config';
import emailService from '@/libs/EmailService';

const ehrReceiver = async (
  queue: string,
  callback: (message: string) => void
) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchange = 'ehr';
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
    console.error('Error occurred while consuming messages from queue:', err);
  }
};

ehrReceiver('send-email', async (msg) => {
  try {
    const parsedBody = JSON.parse(msg);
    await emailService.processEmailEHR(parsedBody);
  } catch (error) {
    console.error('Error processing message:', error);
  }
});
