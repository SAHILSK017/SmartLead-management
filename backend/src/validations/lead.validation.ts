import { z } from 'zod';
import { LeadSource, LeadStatus } from '../types';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource),
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Lead ID is required'),
  }),
});

export const leadParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Lead ID is required'),
  }),
});

export const leadQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional(),
    search: z.string().trim().max(80).optional(),
    sort: z.enum(['latest', 'oldest']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>['body'];
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>['body'];
