import { IEmailTransportService } from "./interfaces/IEmailTransportService";
import { EmailOptions } from "@/types"; // Resolves to services/email/src/types
import { transporter } from "@/config/config_url"; // Resolves to services/email/src/config/config_url

export class EmailTransportService implements IEmailTransportService {
  // No constructor needed as transporter is imported directly.

  async send(options: EmailOptions): Promise<{ rejected: string[] }> {
    // transporter.sendMail can return more fields, but we are interested in 'rejected'
    // as per current usage and interface definition.
    const result = await transporter.sendMail(options);
    return { rejected: result.rejected || [] }; // Ensure rejected is always an array
  }
}
