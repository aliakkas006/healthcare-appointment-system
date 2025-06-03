import { VerificationCode, User } from '@prisma/client';

export interface IVerificationCodeRepository {
  create(data: any): Promise<VerificationCode>;
  findFirst(criteria: any): Promise<VerificationCode | null>;
  update(
    id: string,
    data: Partial<VerificationCode>
  ): Promise<VerificationCode | null>;
}
