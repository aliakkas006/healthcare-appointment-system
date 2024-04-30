import { Response, Request, NextFunction } from 'express';
import { UserCreateSchema } from '@/schemas';
import registrationService from '@/lib/RegistrationService';
import emailService from '@/lib/EmailService';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parsedBody = UserCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const { name, email } = parsedBody.data;

    // Check if the user already exists
    const existingUser = await registrationService.checkExistingUser(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the auth user and user profile
    const user = await registrationService.createUser(parsedBody.data);
    await registrationService.createUserProfile(user.id, name, email);

    // Generate verification code
    const code = emailService.generateVerificationCode();
    await emailService.createVerificationCode(user.id, code);

    // Send verification email
    await emailService.sendVerificationEmail(email, code);

    return res.status(201).json({
      message: 'User created. Check your email for verification code',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export default register;
