import { z } from 'zod';

// Enum definitions
const AppointmentType = z.enum(['CONSULTATION', 'FOLLOWUP']);
const Status = z.enum(['SCHEDULED', 'CONFIRMED', 'CANCELLED']);
const Gender = z.enum(['MALE', 'FEMALE', 'OTHER']);

export const AppointmentCreateShcema = z.object({
  patientId: z.string(),
  providerId: z.string(),
  patientEmail: z.string().email(),
  type: AppointmentType.default('CONSULTATION'),
  status: Status.default('SCHEDULED'),
  notes: z.string().optional(),
  date: z.string(),
});

export const AppointmentUpdateSchema = AppointmentCreateShcema.omit({
  patientId: true,
  providerId: true,
  type: true,
  status: true,
}).partial();

export const PatientCreateSchema = z.object({
  userId: z.string(),
  patientName: z.string(),
  dateOfBirth: z.string(),
  gender: Gender,
  medicalHistory: z.string().optional(),
  insuranceInformation: z.string().optional(),
});

export const PatientUpdateSchema = PatientCreateSchema.omit({
  userId: true,
}).partial();

export const ProviderCreateSchema = z.object({
  userId: z.string(),
  providerName: z.string(),
  speciality: z.string(),
  contactInformation: z.string().optional(),
});

export const ProviderUpdateSchema = ProviderCreateSchema.omit({
  userId: true,
}).partial();
