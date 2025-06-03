import { Request, Response, NextFunction } from 'express';
import { IUserService } from '@/lib/IUserService';

/**
 * Get user by id or authUserId
 * /users/:id?field=id|authUserId
 */
export default (userService: IUserService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const field = req.query.field as string;

      // Get user by id or authUserId
      const user = await userService.getUserById(id, field);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      next(error);
    }
  };
