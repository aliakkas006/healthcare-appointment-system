import { Request, Response, NextFunction } from 'express';
import { UserCreateSchema } from '@/schemas';
import registrationService from '@/lib/RegistrationService';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const parsedBody = UserCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error });
    }

    const { name, email } = parsedBody.data;

    // Check if the user already exists
    const existingUser = await registrationService.checkExistingUser(email);
    if (existingUser) {
      return res.status(400).json({ errors: 'User already exists!' });
    }

    // Create the auth user
    const user = await registrationService.createUser(parsedBody.data);

    // Create the user profile by calling the user service
    await registrationService.createUserProfile(user.id, name, email);

    // Generate verification code
    await registrationService.createVerificationCode(user.id);

    // Send the verification email
    await registrationService.sendVerificationEmail(email);

    // Return the response
    return res.status(201).json({
      message: 'User created. Check your email for verification code',
      user,
    });
  } catch (err) {
    next(err);
  }
};

export default register;
