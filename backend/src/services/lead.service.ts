import { FilterQuery, Types } from 'mongoose';
import { AppError } from '../utils/AppError';
import {
  ILead,
  LeadFilters,
  LeadStatus,
  LeadSource,
  PaginationMeta,
  SortOrder,
} from '../types';
import { CreateLeadInput, UpdateLeadInput } from '../validations/lead.validation';
import { escapeRegex } from '../lib/query';
import { leadRepository } from '../repositories/lead.repository';

type LeadQuery = FilterQuery<ILead>;

const buildLeadQuery = (filters: {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
}): LeadQuery => {
  const query: LeadQuery = {};

  if (filters.status) query['status'] = filters.status;
  if (filters.source) query['source'] = filters.source;

  if (filters.search) {
    const regex = new RegExp(escapeRegex(filters.search), 'i');
    query['$or'] = [{ name: regex }, { email: regex }];
  }

  return query;
};

export const getLeads = async (
  filters: LeadFilters
): Promise<{ leads: ILead[]; pagination: PaginationMeta }> => {
  const { status, source, search, sort, page = 1, limit = 10 } = filters;

  const query = buildLeadQuery({ status, source, search });

  const sortOrder = sort === SortOrder.OLDEST ? 1 : -1;
  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    leadRepository.findMany(query, { skip, limit, sortOrder }),
    leadRepository.count(query),
  ]);

  return {
    leads: leads as unknown as ILead[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getLeadById = async (id: string): Promise<ILead> => {
  const lead = await leadRepository.findById(id);
  if (!lead) throw new AppError('Lead not found', 404);
  return lead as unknown as ILead;
};

export const createLead = async (
  input: CreateLeadInput,
  userId: string
): Promise<ILead> => {
  const lead = await leadRepository.create({
    ...input,
    createdBy: new Types.ObjectId(userId),
  });
  return lead;
};

export const updateLead = async (
  id: string,
  input: UpdateLeadInput
): Promise<ILead> => {
  const lead = await leadRepository.updateById(id, input);
  if (!lead) throw new AppError('Lead not found', 404);
  return lead as unknown as ILead;
};

export const deleteLead = async (id: string): Promise<void> => {
  const lead = await leadRepository.deleteById(id);
  if (!lead) throw new AppError('Lead not found', 404);
};

export const exportLeads = async (filters: {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
}): Promise<ILead[]> => {
  const query = buildLeadQuery(filters);
  return leadRepository.findForExport(query) as unknown as Promise<ILead[]>;
};
