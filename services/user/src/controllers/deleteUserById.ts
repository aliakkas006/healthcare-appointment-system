import { Request, Response, NextFunction } from 'express';
import { IUserService } from '@/lib/IUserService';

export default (userService: IUserService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Delete user by id
    await userService.deleteUserById(id);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
