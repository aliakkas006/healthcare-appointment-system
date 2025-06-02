import { ILoginHistoryRepository } from "./interfaces/ILoginHistoryRepository";
import { LoginHistory, PrismaClient, Prisma } from "@prisma/client";

export class LoginHistoryRepository implements ILoginHistoryRepository {
  private readonly prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async create(data: Prisma.LoginHistoryCreateInput): Promise<LoginHistory> {
    return this.prismaClient.loginHistory.create({ data });
  }
}
