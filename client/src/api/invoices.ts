import { apiClient } from './client';
import type { InvoiceDetail, Note } from '../types';

export async function getInvoice(invoiceNumber: string): Promise<InvoiceDetail> {
  const { data } = await apiClient.get(`/invoices/${encodeURIComponent(invoiceNumber)}`);
  return data;
}

export async function updateInvoiceStatus(invoiceNumber: string, status: string): Promise<InvoiceDetail> {
  const { data } = await apiClient.patch(`/invoices/${encodeURIComponent(invoiceNumber)}/status`, { status });
  return data;
}

export async function getNotes(invoiceNumber: string): Promise<Note[]> {
  const { data } = await apiClient.get(`/invoices/${encodeURIComponent(invoiceNumber)}/notes`);
  return data;
}

export async function addNote(invoiceNumber: string, content: string): Promise<Note> {
  const { data } = await apiClient.post(`/invoices/${encodeURIComponent(invoiceNumber)}/notes`, { content });
  return data;
}
