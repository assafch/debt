import { apiClient } from './client';
import type { SyncLog } from '../types';

export async function triggerSync(): Promise<{ syncLogId: string }> {
  const { data } = await apiClient.post('/sync/trigger');
  return data;
}

export async function getSyncStatus(): Promise<SyncLog> {
  const { data } = await apiClient.get('/sync/status');
  return data;
}
