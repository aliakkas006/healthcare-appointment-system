import { IEHRRepository, EHRWithRelations } from './interfaces/IEHRRepository';
import { EHR, PrismaClient, Prisma } from '@prisma/client';

export class EHRRepository implements IEHRRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findByPatientEmail(patientEmail: string): Promise<EHR | null> {
    return this.prisma.eHR.findUnique({ where: { patientEmail } });
  }

  async create(data: Prisma.EHRCreateInput): Promise<EHR> {
    return this.prisma.eHR.create({ data });
  }

  async findMany(): Promise<EHR[]> {
    return this.prisma.eHR.findMany();
  }

  async findFirstByPatientId(patientId: string): Promise<EHR | null> {
    return this.prisma.eHR.findFirst({ where: { patientId } });
  }

  async findById(id: string): Promise<EHR | null> {
    return this.prisma.eHR.findUnique({ where: { id } });
  }

  async findByIdWithRelations(id: string): Promise<EHRWithRelations | null> {
    const ehrWithRelations = await this.prisma.eHR.findUnique({
      where: { id },
      include: {
        medications: true,
        diagnosticReports: true,
      },
    });

    return ehrWithRelations as EHRWithRelations | null;
  }

  async update(id: string, data: Prisma.EHRUpdateInput): Promise<EHR | null> {
    try {
      return await this.prisma.eHR.update({ where: { id }, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw error;
    }
  }

  async deleteById(id: string): Promise<EHR | null> {
    try {
      return await this.prisma.eHR.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw error;
    }
  }
}
