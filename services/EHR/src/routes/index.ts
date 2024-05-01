import { Router } from 'express';
import { createEHR, getEHRs } from '@/controllers';

const router = Router();

router.post('/ehr', createEHR).get('/ehr', getEHRs);

export default router;
