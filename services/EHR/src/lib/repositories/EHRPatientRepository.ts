import { IEHRPatientRepository } from './interfaces/IEHRPatientRepository';
import { Patient, PrismaClient, Prisma } from '@prisma/client';

export class EHRPatientRepository implements IEHRPatientRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { userId } });
  }

  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    return this.prisma.patient.create({ data });
  }
}
