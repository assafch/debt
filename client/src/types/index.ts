export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'COLLECTOR';
  isActive?: boolean;
  createdAt?: string;
}

export interface Customer {
  priorityCode: string;
  name: string;
  address?: string;
  contactPerson?: string;
  paymentTerms?: string;
  spec1?: string;
  lastSyncedAt?: string;
  totalDebt: number;
  invoiceCount: number;
  maxDaysOverdue: number;
  agingBucket: '0-30' | '30-60' | '60-90' | '90+';
  statuses: string[];
}

export interface CustomerDetail extends Omit<Customer, 'statuses'> {
  invoices: InvoiceDetail[];
}

export interface Invoice {
  invoiceNumber: string;
  customerCode: string;
  customerName: string;
  amount: number;
  issueDate?: string;
  dueDate: string;
  paymentMethod?: string;
  priorityStatus?: string;
  transactionType?: string;
  kline?: number;
  spec1?: string;
  status: string;
  daysOverdue?: number;
  agingBucket?: string;
  lastSyncedAt?: string;
  createdAt?: string;
}

export interface InvoiceDetail extends Invoice {
  notes: Note[];
}

export interface Note {
  id: string;
  invoiceNumber: string;
  authorId: string;
  author: { id: string; fullName: string };
  content: string;
  createdAt: string;
}

export interface SyncLog {
  id?: string;
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'ERROR';
  startedAt?: string;
  finishedAt?: string;
  recordsSync?: number;
  errorMsg?: string;
}

export interface DashboardStats {
  totalDebt: number;
  openInvoiceCount: number;
  customerCount: number;
  agingBuckets: Record<string, number>;
  statusCounts: Record<string, number>;
  lastSyncAt?: string;
}

export const PAYMENT_STATUSES = [
  { value: 'לא שולם', label: 'לא שולם', color: 'bg-red-100 text-red-700' },
  { value: 'בתהליך גבייה', label: 'בתהליך גבייה', color: 'bg-blue-100 text-blue-700' },
  { value: 'שולם חלקית', label: 'שולם חלקית', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'שולם', label: 'שולם', color: 'bg-green-100 text-green-700' },
  { value: 'בוטל', label: 'בוטל', color: 'bg-gray-100 text-gray-600' },
] as const;

export const AGING_BUCKETS = ['0-30', '30-60', '60-90', '90+'] as const;
