import { Email } from "@prisma/client";
import { EmailData } from "@/types"; // Resolves to services/email/src/types

// Define more specific types for appointment and EHR data if possible in future
export interface AppointmentEmailData {
  // Define properties based on what processEmailAppointment expects
  // Example:
  recipient: string;
  patientName?: string;
  doctorName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  [key: string]: any; // Allow other properties for now
}

export interface EHREmailData {
  // Define properties based on what processEmailEHR expects
  // Example:
  recipient: string;
  patientName?: string;
  recordType?: string;
  [key: string]: any; // Allow other properties for now
}

export interface IEmailService {
  sendGenericEmail(data: EmailData): Promise<void>;
  listSentEmails(): Promise<Email[]>;
  processAppointmentNotification(data: AppointmentEmailData): Promise<void>;
  processEHRNotification(data: EHREmailData): Promise<void>;
}
