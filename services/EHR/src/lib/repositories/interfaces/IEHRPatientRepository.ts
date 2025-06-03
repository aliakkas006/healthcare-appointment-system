import { Patient, Prisma } from "@prisma/client";

// This repository interface is specific to Patient operations needed within the EHR context.
// It might overlap with a general PatientRepository in another service (e.g., AppointmentService's IPatientRepository).
// For now, defining it as per the methods used in the current EHRService.ts for Patient.
export interface IEHRPatientRepository {
  findByUserId(userId: string): Promise<Patient | null>;
  create(data: Prisma.PatientCreateInput): Promise<Patient>;
  // findById(id: string): Promise<Patient | null>; // Example: Not currently used by EHRService directly
}
