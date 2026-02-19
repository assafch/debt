import { prisma } from '../lib/prisma';

function calcDaysOverdue(dueDate: Date): number {
  const diff = new Date().getTime() - dueDate.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

export async function getDashboardStats() {
  const [invoiceStats, statusGroups, customerCount, openInvoices, lastSync] = await Promise.all([
    prisma.invoice.aggregate({
      _sum: { amount: true },
      _count: { invoiceNumber: true },
      where: { status: { notIn: ['שולם', 'בוטל'] } },
    }),
    prisma.invoice.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.customer.count(),
    prisma.invoice.findMany({
      where: { status: { notIn: ['שולם', 'בוטל'] } },
      select: { dueDate: true },
    }),
    prisma.syncLog.findFirst({
      where: { status: 'SUCCESS' },
      orderBy: { finishedAt: 'desc' },
      select: { finishedAt: true },
    }),
  ]);

  // Aging buckets
  const agingBuckets = { '0-30': 0, '30-60': 0, '60-90': 0, '90+': 0 };
  for (const inv of openInvoices) {
    const days = calcDaysOverdue(inv.dueDate);
    if (days <= 30) agingBuckets['0-30']++;
    else if (days <= 60) agingBuckets['30-60']++;
    else if (days <= 90) agingBuckets['60-90']++;
    else agingBuckets['90+']++;
  }

  const statusCounts = Object.fromEntries(
    statusGroups.map((g) => [g.status, g._count._all])
  );

  return {
    totalDebt: Number(invoiceStats._sum.amount ?? 0),
    openInvoiceCount: invoiceStats._count.invoiceNumber,
    customerCount,
    agingBuckets,
    statusCounts,
    lastSyncAt: lastSync?.finishedAt ?? null,
  };
}
