import amqp from 'amqplib';

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';

class NotificationService {
  /**
   * Publisher service
   */
  public async publishNotification(notification: any): Promise<void> {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchange = 'notifications';

    await channel.assertExchange(exchange, 'fanout', { durable: false });

    const message = JSON.stringify(notification);

    channel.publish(exchange, '', Buffer.from(message));
    console.log(`Notification sent: ${message}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  }

  /**
   * Subscriber service
   */
  public async handleNotification(
    callback: (notification: any) => void
  ): Promise<void> {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchange = 'notifications';

    await channel.assertExchange(exchange, 'fanout', { durable: false });

    const q = await channel.assertQueue('', { exclusive: true });
    channel.bindQueue(q.queue, exchange, '');

    console.log('Waiting for messages...');

    channel.consume(q.queue, (msg) => {
      if (msg && msg.content) {
        const notification = JSON.parse(msg.content.toString());
        console.log(`Received notification: ${JSON.stringify(notification)}`);
        callback(notification);
      }
      if (msg) {
        channel.ack(msg); // Acknowledge the message if it exists
      }
    });
  }

  /**
   * Notification processor
   */
  public processNotification(notification: any): void {
    // Notification processing based on the notification type
    switch (notification.type) {
      case 'CONFIRMATION':
        console.log(
          `Processing appointment confirmation for ${notification.recipient}`
        );
        // TODO: Logic to send confirmation email

        break;
      case 'REMINDER':
        console.log(
          `Processing appointment reminder for ${notification.recipient}`
        );
        // TODO: Logic to send reminder email
        break;
      case 'CANCELLATION':
        console.log(
          `Processing appointment cancellation for ${notification.recipient}`
        );
        // TODO: Logic to send cancellation email
        break;
      default:
        console.log(`Unknown notification type: ${notification.type}`);
    }

    // After processing, update the notification status to 'READ'
    this.updateNotificationStatus(notification.id, 'READ');
  }

  /**
   * Update notification status
   */
  private updateNotificationStatus(
    notificationId: any,
    newStatus: string
  ): void {
    console.log(
      `Updating notification status to ${newStatus} for ${notificationId}`
    );
  }
}

const notificationService = new NotificationService();

export default notificationService;
