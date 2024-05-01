import { z } from 'zod';

const Medication = z.object({
  id: z.string(),
  name: z.string(),
  dosage: z.string(),
  start_date: z.date(),
  end_date: z.date(),
});

const DiagnosticReport = z.object({
  id: z.string(),
  title: z.string(),
  date: z.date(),
  findings: z.string(),
});

export const EHRCreateSchema = z.object({
  patientId: z.string(),
  patientEmail: z.string().email(),
  medicalHistories: z.array(z.string()),
  allergies: z.array(z.string()),
  medications: z.array(Medication),
  diagnosticReports: z.array(DiagnosticReport),
});

export const EHRUpdateSchema = EHRCreateSchema.omit({
  patientId: true,
}).partial();
