import userService from '@/lib/UserService';
import { Request, Response, NextFunction } from 'express';

const deleteUserById = async (
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

export default deleteUserById;
