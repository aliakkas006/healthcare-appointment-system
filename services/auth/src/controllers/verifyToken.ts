import { Request, Response, NextFunction } from 'express';
import { AccessTokenSchema } from '@/schemas';
import { ITokenService } from '@/lib/services/interfaces/ITokenService';

export default (tokenService: ITokenService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body
      const parsedBody = AccessTokenSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ errors: parsedBody.error.errors });
      }

      const { accessToken } = parsedBody.data;
      const decoded = tokenService.validateAccessToken(accessToken); // Use injected service

      if (!decoded) {
        // If validateAccessToken returns null (e.g., token expired or invalid)
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      const user = await tokenService.getUserFromToken(decoded);
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Unauthorized: User not found' });
      }

      return res.status(200).json({ message: 'Authorized', user });
    } catch (error) {
      next(error);
    }
  };
