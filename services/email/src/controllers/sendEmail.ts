import logger from '@/config/logger'; // Keep logger if used for controller-specific logging
import { IEmailService } from '@/lib/services/interfaces/IEmailService';
import { EmailCreateSchema } from '@/schemas';
import { Request, Response, NextFunction } from 'express';

export default (emailService: IEmailService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body
      const parsedBody = EmailCreateSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.errors });
      }

      await emailService.sendGenericEmail(parsedBody.data);

      return res.status(200).json({ message: 'Email processed successfully' });
    } catch (err) {
      logger.error('Error in sendEmail controller:', err);
      next(err);
    }
  };
