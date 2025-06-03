import { Appointment, Prisma } from "@prisma/client";

export interface IAppointmentRepository {
  create(data: Prisma.AppointmentCreateInput): Promise<Appointment>;
  findMany(): Promise<Appointment[]>;
  findManyByPatientId(patientId: string): Promise<Appointment[]>;
  findManyByProviderId(providerId: string): Promise<Appointment[]>;
  findById(id: string): Promise<Appointment | null>;
  update(id: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment | null>;
  deleteById(id: string): Promise<Appointment | null>;
  findManyByDate(date: string): Promise<Appointment[]>; // Consider Date object if appropriate for queries
}
