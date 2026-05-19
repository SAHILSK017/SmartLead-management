import apiClient from './axios.instance';
import { ApiResponse, AuthResponse } from '../types';

export const authApi = {
  register: async (payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      payload
    );
    return data.data!;
  },

  login: async (payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      payload
    );
    return data.data!;
  },

  me: async (): Promise<AuthResponse['user']> => {
    const { data } = await apiClient.get<ApiResponse<AuthResponse['user']>>(
      '/auth/me'
    );
    return data.data!;
  },
};
