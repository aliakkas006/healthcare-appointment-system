import { Router } from 'express';
import { login, register, verifyToken, verifyEmail } from '@/controllers';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/verify-token', verifyToken);
router.post('/auth/verify-email', verifyEmail);

export default router;
