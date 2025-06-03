export interface IMessageQueueService {
  /**
   * Publishes a message to a specified exchange with a given routing key.
   *
   * @param exchange The name of the exchange to publish the message to.
   * @param routingKey The routing key for the message.
   * @param message The message to publish, typically a string (e.g., JSON stringified object).
   * @returns A promise that resolves when the message has been published.
   *          The promise may reject if publishing fails.
   */
  publish(exchange: string, routingKey: string, message: string): Promise<void>;
}
