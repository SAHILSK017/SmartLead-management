// ─── Enums ────────────────────────────────────────────────────────────────────

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  LOST = 'lost',
}

export enum LeadSource {
  WEBSITE = 'website',
  INSTAGRAM = 'instagram',
  REFERRAL = 'referral',
}

export enum SortOrder {
  LATEST = 'latest',
  OLDEST = 'oldest',
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginationMeta {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

// ─── Lead Filters ─────────────────────────────────────────────────────────────

export interface LeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: SortOrder;
  page?: number;
}
