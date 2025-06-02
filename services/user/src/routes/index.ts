import { Router } from 'express';
import {
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
  getUsers,
} from '@/controllers';
import UserService from '@/lib/UserService';
import { UserRepository } from '@/lib/UserRepository';
import prisma from '@/config/prisma';

const router = Router();

// Instantiate repository and service
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

// User routes
router
  .get('/users/:id', getUserById(userService))
  .put('/users/:id', updateUserById(userService))
  .delete('/users/:id', deleteUserById(userService));

router
  .post('/users', createUser(userService))
  .get('/users', getUsers(userService));

export default router;
