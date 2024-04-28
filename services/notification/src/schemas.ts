import { z } from 'zod';

export const NotificationCreateSchema = z.object({
  userId: z.string(),
  content: z.string().min(1).max(255),
});

export const NotificationUpdateSchema = NotificationCreateSchema.omit({
  userId: true,
});