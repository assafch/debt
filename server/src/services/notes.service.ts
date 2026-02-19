import { prisma } from '../lib/prisma';

export async function getNotes(invoiceNumber: string) {
  return prisma.note.findMany({
    where: { invoiceNumber },
    include: { author: { select: { id: true, fullName: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addNote(invoiceNumber: string, authorId: string, content: string) {
  const trimmed = content.trim();
  if (!trimmed) throw new Error('Note content cannot be empty');

  const invoice = await prisma.invoice.findUnique({ where: { invoiceNumber } });
  if (!invoice) throw new Error('Invoice not found');

  return prisma.note.create({
    data: { invoiceNumber, authorId, content: trimmed },
    include: { author: { select: { id: true, fullName: true } } },
  });
}
