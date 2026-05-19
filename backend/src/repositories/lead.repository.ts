import { FilterQuery, UpdateQuery } from 'mongoose';
import { Lead } from '../models/Lead.model';
import { ILead } from '../types';
import { CreateLeadInput } from '../validations/lead.validation';

interface CreateLeadRecord extends CreateLeadInput {
  createdBy: ILead['createdBy'];
}

export const leadRepository = {
  findMany: (
    query: FilterQuery<ILead>,
    options: { skip: number; limit: number; sortOrder: 1 | -1 }
  ) =>
    Lead.find(query)
      .sort({ createdAt: options.sortOrder })
      .skip(options.skip)
      .limit(options.limit)
      .lean(),

  count: (query: FilterQuery<ILead>) => Lead.countDocuments(query),

  findById: (id: string) => Lead.findById(id).lean(),

  create: (payload: CreateLeadRecord) => Lead.create(payload),

  updateById: (id: string, payload: UpdateQuery<ILead>) =>
    Lead.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean(),

  deleteById: (id: string) => Lead.findByIdAndDelete(id),

  findForExport: (query: FilterQuery<ILead>) =>
    Lead.find(query).sort({ createdAt: -1 }).lean(),
};
