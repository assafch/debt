import { apiClient } from './client';
import type { DashboardStats } from '../types';

export async function getDashboard(): Promise<DashboardStats> {
  const { data } = await apiClient.get('/dashboard');
  return data;
}
