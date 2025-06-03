import { IPatientRepository } from './interfaces/IPatientRepository';
import { Patient, PrismaClient, Prisma } from '@prisma/client';

export class PatientRepository implements IPatientRepository {
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

  async findMany(): Promise<Patient[]> {
    return this.prisma.patient.findMany();
  }

  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { id } });
  }
}
