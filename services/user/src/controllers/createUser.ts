import { Request, Response, NextFunction } from 'express';
import { UserCreateSchema } from '@/schemas';
import userService from '@/lib/UserService';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parsedBody = UserCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ message: parsedBody.error.errors });
    }

    const { authUserId } = parsedBody.data;

    // Check if the authUserId already exists
    const existingUser = await userService.checkExistingUser(authUserId);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Create a new user
    const user = await userService.createUser(parsedBody.data);

    // Return the response
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export default createUser;
