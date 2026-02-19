import { apiClient } from './client';
import type { User } from '../types';

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get('/users');
  return data;
}

export async function createUser(payload: {
  email: string;
  fullName: string;
  role: string;
  password: string;
}): Promise<User> {
  const { data } = await apiClient.post('/users', payload);
  return data;
}

export async function updateUser(
  id: string,
  payload: { fullName?: string; role?: string; isActive?: boolean; password?: string }
): Promise<User> {
  const { data } = await apiClient.patch(`/users/${id}`, payload);
  return data;
}
