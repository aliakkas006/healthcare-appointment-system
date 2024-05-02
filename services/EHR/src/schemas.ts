import { z } from 'zod';

export const MedicationCreateSchema = z.object({
  name: z.string(),
  dosage: z.string(),
  start_date: z.string(),
  end_date: z.string(),
});

export const DiagnosticReportCreateSchema = z.object({
  title: z.string(),
  date: z.string(),
  findings: z.string(),
});

export const EHRCreateSchema = z.object({
  patientId: z.string(),
  patientEmail: z.string().email(),
  medicalHistories: z.array(z.string()),
  allergies: z.array(z.string()),
});

export const EHRUpdateSchema = EHRCreateSchema.omit({
  patientId: true,
}).partial();

export const PatientCreateSchema = z.object({
  userId: z.string(),
  patientName: z.string(),
  dateOfBirth: z.string(),
  medicalHistory: z.string().optional(),
  insuranceInformation: z.string().optional(),
});
