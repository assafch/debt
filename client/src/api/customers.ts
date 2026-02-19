import { apiClient } from './client';
import type { Customer, CustomerDetail } from '../types';

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export async function getCustomers(params: {
  status?: string[];
  aging?: string[];
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CustomersResponse> {
  const query: Record<string, string> = {};
  if (params.status?.length) query.status = params.status.join(',');
  if (params.aging?.length) query.aging = params.aging.join(',');
  if (params.search) query.search = params.search;
  if (params.page) query.page = String(params.page);
  if (params.limit) query.limit = String(params.limit);

  const { data } = await apiClient.get('/customers', { params: query });
  return data;
}

export async function getCustomer(code: string): Promise<CustomerDetail> {
  const { data } = await apiClient.get(`/customers/${encodeURIComponent(code)}`);
  return data;
}
