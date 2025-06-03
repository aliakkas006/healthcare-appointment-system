import { Request, Response, NextFunction } from 'express';
import { IUserService } from '@/lib/IUserService';
import { UserUpdateSchema } from '@/schemas';

export default (userService: IUserService) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const parsedBody = UserUpdateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error.errors });
    }

    const { id } = req.params;

    // Update user by id
    const updatedUser = await userService.updateUserById(id, parsedBody.data);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};
