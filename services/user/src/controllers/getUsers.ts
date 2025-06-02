import { Request, Response, NextFunction } from 'express';
import { IUserService } from '@/lib/IUserService';

export default (userService: IUserService) => async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
