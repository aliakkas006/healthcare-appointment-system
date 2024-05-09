import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
});

export const defaultSender =
  process.env.DEFAULT_SENDER_EMAIL || 'admin@gmail.com';

export const RABBITMQ_URL =
  process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
