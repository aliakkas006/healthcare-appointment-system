import { NotificationType } from '@prisma/client';

export const notification = {
  type: NotificationType || 'CONFIRMATION',
  recipient: 'patient@example.com',
  content: `Your appointment on ${new Date()} is confirmed.`,
};
