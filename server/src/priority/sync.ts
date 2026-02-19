import { prisma } from '../lib/prisma';
import { config } from '../config';
import { fetchODataAll } from './client';
import { Decimal } from '@prisma/client/runtime/library';

interface PriorityCustomer {
  CUSTNAME: string;
  CUSTDES: string;
  ADDRESS?: string;
  ADDRESS2?: string;
  ADDRESS3?: string;
  STATEA?: string;
  ZIP?: string;
  STATDES?: string;
  PAYDES?: string;
  CONTACT?: string;
  SPEC1?: string;
}

interface PriorityInvoice {
  IVNUM: string;
  ACCNAME: string;
  ACCDES: string;
  CURDATE?: string;
  FNCDATE: string;
  SUM: number;
  FNCPATNAME?: string;
  INVOICEFLAG?: string;
  FNCTRANS?: string;
  KLINE?: number;
}

export async function runSync(syncLogId: string): Promise<number> {
  let totalRecords = 0;

  // 1. Fetch and upsert customers
  const customers = await fetchODataAll<PriorityCustomer>(config.PRIORITY_CUSTOMERS_URL);

  for (const c of customers) {
    const addressParts = [c.ADDRESS, c.ADDRESS2, c.ADDRESS3, c.STATEA, c.ZIP].filter(Boolean);
    const address = addressParts.join(', ') || null;

    await prisma.customer.upsert({
      where: { priorityCode: c.CUSTNAME },
      create: {
        priorityCode: c.CUSTNAME,
        name: c.CUSTDES || c.CUSTNAME,
        address,
        priorityStatus: c.STATDES || null,
        paymentTerms: c.PAYDES || null,
        contactPerson: c.CONTACT || null,
        spec1: c.SPEC1 || null,
        lastSyncedAt: new Date(),
      },
      update: {
        name: c.CUSTDES || c.CUSTNAME,
        address,
        priorityStatus: c.STATDES || null,
        paymentTerms: c.PAYDES || null,
        contactPerson: c.CONTACT || null,
        spec1: c.SPEC1 || null,
        lastSyncedAt: new Date(),
      },
    });
  }
  totalRecords += customers.length;

  // 2. Build customer map for spec1 lookup
  const customerMap = new Map<string, PriorityCustomer>();
  for (const c of customers) {
    customerMap.set(c.CUSTNAME, c);
  }

  // 3. Fetch open invoices
  const invoices = await fetchODataAll<PriorityInvoice>(config.PRIORITY_INVOICES_URL);

  // 4. Mark invoices no longer in Priority as "שולם" (paid)
  const apiInvoiceNums = new Set(invoices.map((i) => i.IVNUM));
  const existingOpen = await prisma.invoice.findMany({
    where: { status: { notIn: ['שולם', 'בוטל'] } },
    select: { invoiceNumber: true },
  });
  const nowPaid = existingOpen.filter((i) => !apiInvoiceNums.has(i.invoiceNumber));
  if (nowPaid.length > 0) {
    await prisma.invoice.updateMany({
      where: { invoiceNumber: { in: nowPaid.map((i) => i.invoiceNumber) } },
      data: { status: 'שולם' },
    });
  }

  // 5. Upsert invoices — never overwrite status
  for (const inv of invoices) {
    const customer = customerMap.get(inv.ACCNAME);
    const amount = new Decimal(inv.SUM || 0);

    await prisma.invoice.upsert({
      where: { invoiceNumber: inv.IVNUM },
      create: {
        invoiceNumber: inv.IVNUM,
        customerCode: inv.ACCNAME,
        customerName: inv.ACCDES || inv.ACCNAME,
        amount,
        issueDate: inv.CURDATE ? new Date(inv.CURDATE) : null,
        dueDate: new Date(inv.FNCDATE),
        paymentMethod: inv.FNCPATNAME || null,
        priorityStatus: inv.INVOICEFLAG || null,
        transactionType: inv.FNCTRANS || null,
        kline: inv.KLINE ?? null,
        spec1: customer?.SPEC1 || null,
        lastSyncedAt: new Date(),
      },
      update: {
        customerCode: inv.ACCNAME,
        customerName: inv.ACCDES || inv.ACCNAME,
        amount,
        issueDate: inv.CURDATE ? new Date(inv.CURDATE) : null,
        dueDate: new Date(inv.FNCDATE),
        paymentMethod: inv.FNCPATNAME || null,
        priorityStatus: inv.INVOICEFLAG || null,
        transactionType: inv.FNCTRANS || null,
        kline: inv.KLINE ?? null,
        spec1: customer?.SPEC1 || null,
        lastSyncedAt: new Date(),
        // status is NOT updated — collector owns it
      },
    });
  }
  totalRecords += invoices.length;

  // 6. Update sync log
  await prisma.syncLog.update({
    where: { id: syncLogId },
    data: {
      status: 'SUCCESS',
      finishedAt: new Date(),
      recordsSync: totalRecords,
    },
  });

  return totalRecords;
}

export async function triggerSync(): Promise<string> {
  // Check if a sync is already running
  const running = await prisma.syncLog.findFirst({
    where: { status: 'RUNNING' },
    orderBy: { startedAt: 'desc' },
  });
  if (running) return running.id;

  const log = await prisma.syncLog.create({
    data: { status: 'RUNNING' },
  });

  // Run async — don't await
  runSync(log.id).catch(async (err: Error) => {
    console.error('Sync failed:', err.message);
    await prisma.syncLog.update({
      where: { id: log.id },
      data: {
        status: 'ERROR',
        finishedAt: new Date(),
        errorMsg: err.message,
      },
    });
  });

  return log.id;
}
