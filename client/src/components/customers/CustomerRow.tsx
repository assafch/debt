import { useState } from 'react';
import type { Customer } from '../../types';
import InvoiceSubTable from './InvoiceSubTable';

interface Props {
  customer: Customer;
}

function AgingBadge({ days }: { days: number }) {
  let cls = 'bg-green-100 text-green-700';
  if (days > 90) cls = 'bg-red-100 text-red-700';
  else if (days > 60) cls = 'bg-orange-100 text-orange-700';
  else if (days > 30) cls = 'bg-yellow-100 text-yellow-700';

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {days} יום
    </span>
  );
}

function formatCurrency(amount: number) {
  return '₪' + amount.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function CustomerRow({ customer }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
          expanded ? 'bg-blue-50' : ''
        }`}
        onClick={() => setExpanded((e) => !e)}
      >
        <td className="px-3 py-3 text-center">
          <span
            className={`text-gray-400 text-xs font-bold transition-transform inline-block ${
              expanded ? 'rotate-90' : ''
            }`}
          >
            ▶
          </span>
        </td>
        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{customer.priorityCode}</td>
        <td className="px-4 py-3 font-medium text-gray-800">{customer.name}</td>
        <td className="px-4 py-3 text-gray-600 text-xs">{customer.contactPerson || '—'}</td>
        <td className="px-4 py-3 text-left font-bold text-red-600">
          {formatCurrency(customer.totalDebt)}
        </td>
        <td className="px-4 py-3">
          <AgingBadge days={customer.maxDaysOverdue} />
        </td>
        <td className="px-4 py-3 text-center">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            {customer.invoiceCount}
          </span>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={7} className="p-0 bg-blue-50">
            <InvoiceSubTable customerCode={customer.priorityCode} />
          </td>
        </tr>
      )}
    </>
  );
}
