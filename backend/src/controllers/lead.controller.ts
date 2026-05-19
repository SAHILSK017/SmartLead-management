import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../services/lead.service';
import { AuthenticatedRequest, LeadFilters, LeadSource, LeadStatus, SortOrder } from '../types';
import { AppError } from '../utils/AppError';
import { buildCsvString } from '../utils/csvExport';
import { clampNumber } from '../lib/query';

export const getAllLeads = asyncHandler(async (req: Request, res: Response) => {
  const filters: LeadFilters = {
    status: req.query['status'] as LeadStatus | undefined,
    source: req.query['source'] as LeadSource | undefined,
    search: req.query['search'] as string | undefined,
    sort: req.query['sort'] as SortOrder | undefined,
    page: clampNumber(req.query['page'], 1, 1, 10_000),
    limit: clampNumber(req.query['limit'], 10, 1, 100),
  };

  const { leads, pagination } = await getLeads(filters);
  sendPaginated(res, leads, pagination);
});

export const getOneLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await getLeadById(req.params['id'] as string);
  sendSuccess(res, lead);
});

export const createOneLead = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) throw new AppError('Not authenticated', 401);
  const lead = await createLead(req.body, authReq.user.userId);
  sendSuccess(res, lead, 'Lead created', 201);
});

export const updateOneLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await updateLead(req.params['id'] as string, req.body);
  sendSuccess(res, lead, 'Lead updated');
});

export const deleteOneLead = asyncHandler(async (req: Request, res: Response) => {
  await deleteLead(req.params['id'] as string);
  sendSuccess(res, null, 'Lead deleted');
});

export const exportLeadsCsv = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    status: req.query['status'] as LeadStatus | undefined,
    source: req.query['source'] as LeadSource | undefined,
    search: req.query['search'] as string | undefined,
  };

  const leads = await exportLeads(filters);
  const csv = buildCsvString(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.status(200).send(csv);
});
