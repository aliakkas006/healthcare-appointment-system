import { Appointment, Prisma } from "@prisma/client";

export interface IAppointmentService {
  createAppointment(appointmentData: Prisma.AppointmentCreateInput): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByPatientId(patientId: string): Promise<Appointment[]>;
  getAppointmentsByProviderId(providerId: string): Promise<Appointment[]>;
  getAppointmentById(appointmentId: string): Promise<Appointment | null>;
  updateAppointment(appointmentId: string, appointmentData: Prisma.AppointmentUpdateInput): Promise<Appointment | null>;
  deleteAppointment(appointmentId: string): Promise<Appointment | null>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>; // Consider Date object if appropriate
}
