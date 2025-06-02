import { VerificationCode, User } from "@prisma/client"; // User might be needed for relation or specific query types

export interface IVerificationCodeRepository {
  create(data: any): Promise<VerificationCode>; // TODO: Refine 'any' to VerificationCodeCreateInput
  findFirst(criteria: any): Promise<VerificationCode | null>; // TODO: Refine 'any' to specific query criteria type
  update(id: string, data: Partial<VerificationCode>): Promise<VerificationCode | null>;
}
