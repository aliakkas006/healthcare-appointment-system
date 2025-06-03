import { IProviderRepository } from "./interfaces/IProviderRepository";
import { HealthcareProvider, PrismaClient, Prisma } from "@prisma/client";

export class ProviderRepository implements IProviderRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findByUserId(userId: string): Promise<HealthcareProvider | null> {
    return this.prisma.healthcareProvider.findUnique({ where: { userId } });
  }

  async create(data: Prisma.HealthcareProviderCreateInput): Promise<HealthcareProvider> {
    return this.prisma.healthcareProvider.create({ data });
  }

  async findMany(): Promise<HealthcareProvider[]> {
    return this.prisma.healthcareProvider.findMany();
  }
}
