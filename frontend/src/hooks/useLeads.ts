import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../api/leads.api';
import { CreateLeadPayload, LeadFilters, UpdateLeadPayload } from '../types';

const LEADS_KEY = 'leads';

export const useLeads = (filters: LeadFilters) =>
  useQuery({
    queryKey: [LEADS_KEY, filters],
    queryFn: () => leadsApi.getAll(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [LEADS_KEY] }),
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) =>
      leadsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [LEADS_KEY] }),
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [LEADS_KEY] }),
  });
};
