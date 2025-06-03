import { Request, Response, NextFunction } from 'express';
import { IEmailService } from '@/lib/services/interfaces/IEmailService';

export default (emailService: IEmailService) =>
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const emails = await emailService.listSentEmails();
      res.status(200).json(emails);
    } catch (error) {
      next(error);
    }
  };
