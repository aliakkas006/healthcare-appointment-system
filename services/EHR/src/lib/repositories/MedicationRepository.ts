import { IMedicationRepository } from "./interfaces/IMedicationRepository";
import { Medication, PrismaClient, Prisma } from "@prisma/client";

export class MedicationRepository implements IMedicationRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async create(data: Prisma.MedicationCreateInput): Promise<Medication> {
    return this.prisma.medication.create({ data });
  }

  async findMany(): Promise<Medication[]> {
    return this.prisma.medication.findMany();
  }

  async findManyByEhrId(ehrId: string): Promise<Medication[]> {
    return this.prisma.medication.findMany({ where: { ehrId } });
  }
}
