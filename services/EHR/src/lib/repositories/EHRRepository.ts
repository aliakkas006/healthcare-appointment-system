import { IEHRRepository, EHRWithRelations } from "./interfaces/IEHRRepository";
import { eHR, Medication, DiagnosticReport, PrismaClient, Prisma } from "@prisma/client";

export class EHRRepository implements IEHRRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findByPatientEmail(patientEmail: string): Promise<eHR | null> {
    return this.prisma.eHR.findUnique({ where: { patientEmail } });
  }

  async create(data: Prisma.eHRCreateInput): Promise<eHR> {
    return this.prisma.eHR.create({ data });
  }

  async findMany(): Promise<eHR[]> {
    return this.prisma.eHR.findMany();
  }

  async findFirstByPatientId(patientId: string): Promise<eHR | null> {
    return this.prisma.eHR.findFirst({ where: { patientId } });
  }

  async findById(id: string): Promise<eHR | null> {
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
    // Ensure the return type matches EHRWithRelations, especially if relations can be undefined
    // Prisma's include typically makes them arrays (empty if no relations) or null if the main record not found.
    // If ehrWithRelations is null, we return null. Otherwise, it matches the type.
    return ehrWithRelations as EHRWithRelations | null;
  }

  async update(id: string, data: Prisma.eHRUpdateInput): Promise<eHR | null> {
    try {
      return await this.prisma.eHR.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteById(id: string): Promise<eHR | null> {
    try {
      return await this.prisma.eHR.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
