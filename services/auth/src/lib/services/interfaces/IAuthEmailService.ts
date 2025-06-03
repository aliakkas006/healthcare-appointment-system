import { User, VerificationCode } from '@prisma/client';

export interface IAuthEmailService {
  createVerificationCode(userId: string, code: string): Promise<void>;
  sendVerificationEmail(recipient: string, code: string): Promise<void>;
  verifyUserEmail(
    email: string,
    code: string
  ): Promise<{ user: User; verificationCode: VerificationCode }>;
  updateUserStatus(userId: string): Promise<void>;
  updateVerificationCodeStatus(verificationCodeId: string): Promise<void>;
  sendVerificationSuccessEmail(recipient: string): Promise<void>;
}
