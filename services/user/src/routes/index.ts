import { Router } from 'express';
import { getUserById, updateUserById, deleteUserById, createUser } from '@/controllers';

const router = Router();

router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUserById);
router.post('/users', createUser);

export default router;
