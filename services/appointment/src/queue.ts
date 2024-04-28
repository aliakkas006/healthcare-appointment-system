import amqp from 'amqplib';
import { RABBITMQ_URL } from '@/config';

const sendToQueue = async (queue: string, message: string): Promise<void> => {
  let connection: amqp.Connection | null = null;
  try {
    // Establishing connection
    connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchange = 'appointment';
    await channel.assertExchange(exchange, 'direct', { durable: true });

    // Publishing the message to the queue
    channel.publish(exchange, queue, Buffer.from(message));
    console.log(`Sent "${message}" to queue "${queue}"`);

    // Close the connection after a short delay
    setTimeout(() => {
      if (connection) {
        connection.close().then(() => console.log('Connection closed'));
      }
    }, 500);
  } catch (err: any) {
    console.error(
      'Error occurred while sending message to queue:',
      err.message
    );
    if (connection) {
      connection
        .close()
        .then(() => console.log('Connection closed due to error'));
    }
    throw err;
  }
};

export default sendToQueue;
