import { Router } from 'express';
import { getEmails, sendEmail } from '@/controllers';

const router = Router();

router.get('/emails', getEmails);
router.post('/emails/send', sendEmail);

export default router;
