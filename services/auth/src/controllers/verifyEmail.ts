import { Request, Response, NextFunction } from 'express';
import { EmailVerificationSchema } from '@/schemas';
import { IAuthEmailService } from '@/lib/services/interfaces/IAuthEmailService';

export default (authEmailService: IAuthEmailService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body
      const parsedBody = EmailVerificationSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.errors });
      }

      const { email, code } = parsedBody.data;

      // Verify the user email
      const { user, verificationCode } = await authEmailService.verifyUserEmail(
        email,
        code
      );

      // Update user status to verified
      await authEmailService.updateUserStatus(user.id);

      // Update verification code status to used
      await authEmailService.updateVerificationCodeStatus(verificationCode.id);

      // Send verification success email
      await authEmailService.sendVerificationSuccessEmail(user.email);

      // Return success response
      return res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
      next(error);
    }
  };
