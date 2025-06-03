import { Email } from '@prisma/client';
import { EmailData } from '@/types';

export interface AppointmentEmailData {
  recipient: string;
  patientName?: string;
  doctorName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  [key: string]: any;
}

export interface EHREmailData {
  recipient: string;
  patientName?: string;
  recordType?: string;
  [key: string]: any;
}

export interface IEmailService {
  sendGenericEmail(data: EmailData): Promise<void>;
  listSentEmails(): Promise<Email[]>;
  processAppointmentNotification(data: AppointmentEmailData): Promise<void>;
  processEHRNotification(data: EHREmailData): Promise<void>;
}
