import { Router } from 'express';
import {
  getAllLeads,
  getOneLead,
  createOneLead,
  updateOneLead,
  deleteOneLead,
  exportLeadsCsv,
} from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createLeadSchema,
  leadParamsSchema,
  leadQuerySchema,
  updateLeadSchema,
} from '../validations/lead.validation';
import { UserRole } from '../types';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

router.get('/export', validate(leadQuerySchema), exportLeadsCsv);
router.get('/', validate(leadQuerySchema), getAllLeads);
router.get('/:id', validate(leadParamsSchema), getOneLead);
router.post('/', validate(createLeadSchema), createOneLead);
router.put('/:id', validate(updateLeadSchema), updateOneLead);
router.delete('/:id', requireRole(UserRole.ADMIN), validate(leadParamsSchema), deleteOneLead);

export default router;
