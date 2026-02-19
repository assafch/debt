import { apiClient } from './client';
import type { User } from '../types';

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
}
