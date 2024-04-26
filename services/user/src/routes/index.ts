import { Router } from 'express';
import {
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
  getUsers,
} from '@/controllers';

const router = Router();

router
  .get('/users/:id', getUserById)
  .put('/users/:id', updateUserById)
  .delete('/users/:id', deleteUserById);
router.post('/users', createUser).get('/users', getUsers);

export default router;
