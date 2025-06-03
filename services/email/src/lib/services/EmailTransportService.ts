import { IEmailTransportService } from './interfaces/IEmailTransportService';
import { EmailOptions } from '@/types';
import { transporter } from '@/config/config_url';

export class EmailTransportService implements IEmailTransportService {
  async send(options: EmailOptions): Promise<{ rejected: string[] }> {
    const result = await transporter.sendMail(options);
    return {
      rejected: (result.rejected || [])
        .map((item) =>
          typeof item === 'string'
            ? item
            : item && typeof item.address === 'string'
            ? item.address
            : ''
        )
        .filter((item): item is string => !!item),
    };
  }
}
