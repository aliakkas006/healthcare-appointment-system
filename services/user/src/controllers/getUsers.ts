import userService from '@/lib/UserService';
import { Request, Response, NextFunction } from 'express';

const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export default getUsers;
