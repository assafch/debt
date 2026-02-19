import { prisma } from '../lib/prisma';

const today = () => new Date();

function calcDaysOverdue(dueDate: Date): number {
  const diff = today().getTime() - dueDate.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

function agingBucket(days: number): string {
  if (days <= 30) return '0-30';
  if (days <= 60) return '30-60';
  if (days <= 90) return '60-90';
  return '90+';
}

export async function listCustomers(filters: {
  status?: string[];
  aging?: string[];
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(200, Math.max(1, filters.limit ?? 50));
  const skip = (page - 1) * limit;

  const customers = await prisma.customer.findMany({
    include: {
      invoices: {
        where: { status: { notIn: ['שולם', 'בוטל'] } },
        select: { amount: true, dueDate: true, status: true },
      },
    },
  });

  // Build customer summaries with computed fields
  let result = customers.map((c) => {
    const invoices = c.invoices;
    const totalDebt = invoices.reduce((sum, i) => sum + Number(i.amount), 0);
    const dueDays = invoices.map((i) => calcDaysOverdue(i.dueDate));
    const maxDaysOverdue = dueDays.length > 0 ? Math.max(...dueDays) : 0;
    const bucket = agingBucket(maxDaysOverdue);
    const statuses = [...new Set(invoices.map((i) => i.status))];

    return {
      priorityCode: c.priorityCode,
      name: c.name,
      address: c.address,
      contactPerson: c.contactPerson,
      paymentTerms: c.paymentTerms,
      spec1: c.spec1,
      lastSyncedAt: c.lastSyncedAt,
      totalDebt,
      invoiceCount: invoices.length,
      maxDaysOverdue,
      agingBucket: bucket,
      statuses,
    };
  });

  // Filter: only customers with open invoices
  result = result.filter((c) => c.invoiceCount > 0);

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) => c.name.toLowerCase().includes(q) || c.priorityCode.toLowerCase().includes(q)
    );
  }

  // Filter by aging bucket
  if (filters.aging && filters.aging.length > 0) {
    result = result.filter((c) => filters.aging!.includes(c.agingBucket));
  }

  // Filter by invoice status
  if (filters.status && filters.status.length > 0) {
    result = result.filter((c) => c.statuses.some((s) => filters.status!.includes(s)));
  }

  // Sort: highest debt first
  result.sort((a, b) => b.totalDebt - a.totalDebt);

  const total = result.length;
  const data = result.slice(skip, skip + limit);

  return { data, total, page, limit };
}

export async function getCustomerWithInvoices(priorityCode: string) {
  const customer = await prisma.customer.findUnique({
    where: { priorityCode },
    include: {
      invoices: {
        orderBy: { dueDate: 'asc' },
        include: {
          notes: {
            include: { author: { select: { fullName: true, id: true } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  });

  if (!customer) return null;

  const invoices = customer.invoices.map((inv) => ({
    ...inv,
    amount: Number(inv.amount),
    daysOverdue: calcDaysOverdue(inv.dueDate),
    agingBucket: agingBucket(calcDaysOverdue(inv.dueDate)),
  }));

  const totalDebt = invoices
    .filter((i) => !['שולם', 'בוטל'].includes(i.status))
    .reduce((sum, i) => sum + i.amount, 0);

  return { ...customer, invoices, totalDebt };
}
