import { Email } from "@prisma/client";
import { EmailData } from "@/types"; // This will resolve to services/email/src/types

export interface IEmailRepository {
  createEmailRecord(data: EmailData): Promise<Email>;
  getAllEmailRecords(): Promise<Email[]>;
  // Potential future methods:
  // findEmailById(id: string): Promise<Email | null>;
  // findEmailsByRecipient(recipient: string): Promise<Email[]>;
}
