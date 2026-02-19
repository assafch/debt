import { prisma } from '../lib/prisma';

const VALID_STATUSES = ['לא שולם', 'בתהליך גבייה', 'שולם חלקית', 'שולם', 'בוטל'];

export async function updateStatus(invoiceNumber: string, status: string) {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  return prisma.invoice.update({
    where: { invoiceNumber },
    data: { status },
  });
}

export async function getInvoice(invoiceNumber: string) {
  return prisma.invoice.findUnique({
    where: { invoiceNumber },
    include: {
      notes: {
        include: { author: { select: { id: true, fullName: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}
