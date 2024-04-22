import { Request, Response, NextFunction } from 'express';
import emailService from '@/libs/EmailService';

const getEmails = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const emails = await emailService.getEmails();

    res.status(200).json(emails);
  } catch (error) {
    next(error);
  }
};

export default getEmails;
