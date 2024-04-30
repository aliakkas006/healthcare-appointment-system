import { Request, Response, NextFunction } from 'express';
import { AccessTokenSchema } from '@/schemas';
import tokenService from '@/lib/TokenService';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parsedBody = AccessTokenSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const { accessToken } = parsedBody.data;
    const decoded = tokenService.validateAccessToken(accessToken);

    const user = await tokenService.getUserFromToken(decoded);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.status(200).json({ message: 'Authorized', user });
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
