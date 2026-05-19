import { Response } from 'express';
import { ApiResponse, PaginatedResponse, PaginationMeta } from '../types';
import { HttpStatus } from '../constants/http';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: number = HttpStatus.OK
): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message = 'Success'
): Response => {
  const response: PaginatedResponse<T> & { message: string } = {
    success: true,
    message,
    data,
    pagination,
  };
  return res.status(HttpStatus.OK).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
): Response => {
  const response: ApiResponse = { success: false, message };
  return res.status(statusCode).json(response);
};
