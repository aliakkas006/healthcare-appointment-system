import { Request, Response, NextFunction } from 'express';
import { EmailVerificationSchema } from '@/schemas';
import emailService from '@/lib/EmailService';

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parsedBody = EmailVerificationSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const { email, code } = parsedBody.data;

    // Verify the user email
    const { user, verificationCode } = await emailService.verifyUserEmail(
      email,
      code
    );

    // Update user status to verified
    await emailService.updateUserStatus(user.id);

    // Update verification code status to used
    await emailService.updateVerificationCodeStatus(verificationCode.id);

    // Send verification success email
    await emailService.sendVerificationSuccessEmail(user.email);

    // Return success response
    return res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

export default verifyEmail;
