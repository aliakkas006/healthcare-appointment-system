import { Router } from 'express';
import prisma from '@/config/prisma';

// Repository Classes
import { AuthUserRepository } from '@/lib/repositories/AuthUserRepository';
import { LoginHistoryRepository } from '@/lib/repositories/LoginHistoryRepository';
import { VerificationCodeRepository } from '@/lib/repositories/VerificationCodeRepository';

// Service Classes
import LoginService from '@/lib/LoginService';
import RegistrationService from '@/lib/RegistrationService';
import TokenService from '@/lib/TokenService';
import AuthEmailService from '@/lib/AuthEmailService'; // Corrected name

// Controller Factory Functions
import login from '@/controllers/login';
import register from '@/controllers/register';
import verifyToken from '@/controllers/verifyToken';
import verifyEmail from '@/controllers/verifyEmail';

const router = Router();

// Instantiate Repositories
const authUserRepository = new AuthUserRepository(prisma);
const loginHistoryRepository = new LoginHistoryRepository(prisma);
const verificationCodeRepository = new VerificationCodeRepository(prisma);

// Instantiate Services (Injecting Repositories)
const loginService = new LoginService(authUserRepository, loginHistoryRepository);
const registrationService = new RegistrationService(authUserRepository);
const tokenService = new TokenService(authUserRepository);
const authEmailService = new AuthEmailService(authUserRepository, verificationCodeRepository);

// Update Route Definitions
router.post('/auth/register', register(registrationService, authEmailService));
router.post('/auth/login', login(loginService));
router.post('/auth/verify-token', verifyToken(tokenService));
router.post('/auth/verify-email', verifyEmail(authEmailService));

export default router;
