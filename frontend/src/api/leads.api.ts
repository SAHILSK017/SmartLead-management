import apiClient from './axios.instance';
import {
  Lead,
  CreateLeadPayload,
  UpdateLeadPayload,
  PaginatedResponse,
  ApiResponse,
  LeadFilters,
} from '../types';

export const leadsApi = {
  getAll: async (filters: LeadFilters): Promise<PaginatedResponse<Lead>> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
    );
    const { data } = await apiClient.get<PaginatedResponse<Lead>>('/leads', {
      params,
    });
    return data;
  },

  getOne: async (id: string): Promise<Lead> => {
    const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data.data!;
  },

  create: async (payload: CreateLeadPayload): Promise<Lead> => {
    const { data } = await apiClient.post<ApiResponse<Lead>>('/leads', payload);
    return data.data!;
  },

  update: async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    const { data } = await apiClient.put<ApiResponse<Lead>>(
      `/leads/${id}`,
      payload
    );
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  exportCsv: async (filters: Omit<LeadFilters, 'page' | 'sort'>): Promise<Blob> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
    );
    const { data } = await apiClient.get<Blob>('/leads/export', {
      params,
      responseType: 'blob',
    });
    return data;
  },
};
