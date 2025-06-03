import { EmailOptions } from '@/types';

export interface IEmailTransportService {
  send(options: EmailOptions): Promise<{ rejected: string[] }>;
}
