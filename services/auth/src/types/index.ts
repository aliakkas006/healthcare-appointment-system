import { LoginAttempt } from '@prisma/client';

export type LoginHistory = {
  userId: string;
  userAgent: string | undefined;
  ipAddress: string | undefined;
  attempt: LoginAttempt;
};

export type UserData = {
  name: string;
  email: string;
  password: string;
};
