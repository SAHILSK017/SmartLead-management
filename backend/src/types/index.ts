import { Request } from 'express';
import { Document } from 'mongoose';

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

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPublic {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
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

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

// ─── Lead Query Filters ────────────────────────────────────────────────────────

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}
