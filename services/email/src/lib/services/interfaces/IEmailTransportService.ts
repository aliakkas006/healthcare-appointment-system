import { EmailOptions } from "@/types"; // This will resolve to services/email/src/types

export interface IEmailTransportService {
  send(options: EmailOptions): Promise<{ rejected: string[] }>;
}
