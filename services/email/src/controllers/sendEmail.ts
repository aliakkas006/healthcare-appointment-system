import logger from '@/config/logger'; // Keep logger if used for controller-specific logging
import { IEmailService } from '@/lib/services/interfaces/IEmailService';
import { EmailCreateSchema } from '@/schemas';
import { Request, Response, NextFunction } from 'express';

export default (emailService: IEmailService) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parsedBody = EmailCreateSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    // The parsedBody.data should conform to EmailData type expected by sendGenericEmail
    // EmailData includes: sender (optional), recipient, subject, body, source.
    // The EmailCreateSchema should align with this.
    // The sendGenericEmail method in MainEmailService will handle default sender logic.
    await emailService.sendGenericEmail(parsedBody.data);

    return res.status(200).json({ message: 'Email processed successfully' });
  } catch (err) {
    // sendGenericEmail might throw errors (e.g., from transport or db write if not caught and re-thrown)
    // Or it might handle them internally and not throw.
    // Assuming errors that reach here are critical failures.
    logger.error('Error in sendEmail controller:', err); // Controller-level logging
    next(err);
  }
};
