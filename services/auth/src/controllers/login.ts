import { Response, Request, NextFunction } from 'express';
import { UserLoginSchema } from '@/schemas';
import loginService from '@/lib/LoginService';

const login = async (req: Request, res: Response, next: NextFunction) => {
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
    const user = await loginService.login(email, password);

    // Generate access token
    const accessToken = loginService.generateAccessToken(
      user.id,
      user.email,
      user.name,
      user.role
    );

    // Create login history
    await loginService.createLoginHistory({
      userId: user.id,
      userAgent,
      ipAddress,
      attempt: 'SUCCESS',
    });

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export default login;
