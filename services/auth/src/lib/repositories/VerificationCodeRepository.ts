import { IVerificationCodeRepository } from "./interfaces/IVerificationCodeRepository";
import { VerificationCode, PrismaClient, Prisma } from "@prisma/client";

export class VerificationCodeRepository implements IVerificationCodeRepository {
  private readonly prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async create(data: Prisma.VerificationCodeCreateInput): Promise<VerificationCode> {
    return this.prismaClient.verificationCode.create({ data });
  }

  async findFirst(criteria: Prisma.VerificationCodeFindFirstArgs['where']): Promise<VerificationCode | null> {
    return this.prismaClient.verificationCode.findFirst({ where: criteria });
  }

  async update(id: string, data: Prisma.VerificationCodeUpdateInput): Promise<VerificationCode | null> {
    return this.prismaClient.verificationCode.update({
      where: { id },
      data,
    });
  }
}
