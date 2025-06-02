import { Response, Request, NextFunction } from 'express';
import { UserLoginSchema } from '@/schemas';
import { ILoginService } from '@/lib/services/interfaces/ILoginService';

export default (loginService: ILoginService) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || '';
    const userAgent = req.headers['user-agent'] || '';

    // Validate the request body
    const parsedBody = UserLoginSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const { email, password } = parsedBody.data;

    // Authenticate user
    const user = await loginService.login(email, password); // Use injected service

    // Generate access token
    const accessToken = loginService.generateAccessToken( // Use injected service
      user.id,
      user.email,
      user.name,
      user.role
    );

    // Create login history
    await loginService.createLoginHistory({ // Use injected service
      userId: user.id,
      userAgent,
      ipAddress,
      attempt: 'SUCCESS',
    });

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    // If login fails and createLoginHistory is called, it might log a failed attempt.
    // This depends on where the error is thrown in loginService.login
    // For now, assuming error in login() prevents history creation or is handled by caller.
    // Consider adding specific error handling to record 'FAILED' attempts if not done in service.
    next(error);
  }
};
