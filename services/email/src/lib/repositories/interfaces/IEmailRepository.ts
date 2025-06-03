import { Email } from "@prisma/client";
import { EmailData } from "@/types"; 

export interface IEmailRepository {
  createEmailRecord(data: EmailData): Promise<Email>;
  getAllEmailRecords(): Promise<Email[]>;
}
