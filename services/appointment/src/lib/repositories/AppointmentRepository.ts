import { IAppointmentRepository } from "./interfaces/IAppointmentRepository";
import { Appointment, PrismaClient, Prisma } from "@prisma/client";

export class AppointmentRepository implements IAppointmentRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return this.prisma.appointment.create({ data });
  }

  async findMany(): Promise<Appointment[]> {
    return this.prisma.appointment.findMany();
  }

  async findManyByPatientId(patientId: string): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({ where: { patientId } });
  }

  async findManyByProviderId(providerId: string): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({ where: { providerId } });
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.prisma.appointment.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment | null> {
    try {
      return await this.prisma.appointment.update({ where: { id }, data });
    } catch (error) {
      // Handle specific Prisma errors like P2025 (Record to update not found) if needed
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null; // Or throw a custom not found error
      }
      throw error; // Re-throw other errors
    }
  }

  async deleteById(id: string): Promise<Appointment | null> {
    try {
      return await this.prisma.appointment.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null; // Or throw a custom not found error
      }
      throw error;
    }
  }

  async findManyByDate(date: string): Promise<Appointment[]> {
    // Assuming 'date' is a string in ISO format that can be directly queried.
    // If 'date' field in Prisma schema is DateTime, direct string comparison might work
    // or might need conversion/range query depending on DB and Prisma version.
    // For simplicity, using direct equality.
    return this.prisma.appointment.findMany({ where: { date } });
  }
}
