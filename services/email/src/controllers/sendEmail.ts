import { defaultSender } from '@/config/config_url';
import logger from '@/config/logger';
import emailService from '@/libs/EmailService';
import { EmailCreateSchema } from '@/schemas';
import { Request, Response, NextFunction } from 'express';

const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parsedBody = EmailCreateSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const { sender, recipient, subject, body, source } = parsedBody.data;

    // Define the email options
    const emailOptions = {
      from: sender || defaultSender,
      to: recipient,
      subject,
      text: body,
    };

    // Send the email
    const { rejected } = await emailService.sendEmail(emailOptions);

    if (rejected.length) {
      logger.info('Email rejected', rejected);
      return res.status(500).json({ message: 'Failed' });
    }

    // Save the email to the database
    await emailService.saveEmailToDB({
      sender,
      recipient,
      subject,
      body,
      source,
    });

    return res.status(200).json({ message: 'Email Sent successfully' });
  } catch (err) {
    next(err);
  }
};

export default sendEmail;
