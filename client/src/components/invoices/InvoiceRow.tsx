import { useState } from 'react';
import type { InvoiceDetail } from '../../types';
import StatusSelect from './StatusSelect';
import NotesPanel from './NotesPanel';

interface Props {
  invoice: InvoiceDetail;
}

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function formatCurrency(amount: number) {
  return '₪' + amount.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function DaysOverdueBadge({ days }: { days: number }) {
  if (days <= 0) return <span className="text-green-600 text-xs">לא באיחור</span>;
  let cls = 'text-yellow-600';
  if (days > 90) cls = 'text-red-600 font-bold';
  else if (days > 60) cls = 'text-orange-600';
  return <span className={`text-xs ${cls}`}>{days} יום</span>;
}

export default function InvoiceRow({ invoice }: Props) {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-2.5 font-mono text-xs text-gray-700">{invoice.invoiceNumber}</td>
        <td className="px-4 py-2.5 text-left font-semibold text-gray-800">
          {formatCurrency(invoice.amount)}
        </td>
        <td className="px-4 py-2.5 text-gray-600 text-xs">{formatDate(invoice.dueDate)}</td>
        <td className="px-4 py-2.5">
          <DaysOverdueBadge days={invoice.daysOverdue ?? 0} />
        </td>
        <td className="px-4 py-2.5">
          <StatusSelect invoiceNumber={invoice.invoiceNumber} currentStatus={invoice.status} />
        </td>
        <td className="px-4 py-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNotesOpen((o) => !o);
            }}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            <span>💬</span>
            <span>
              {invoice.notes.length > 0
                ? `${invoice.notes.length} הערות`
                : 'הוסף הערה'}
            </span>
          </button>
        </td>
      </tr>

      {notesOpen && (
        <tr>
          <td colSpan={6} className="p-0 bg-yellow-50 border-b border-yellow-100">
            <NotesPanel invoiceNumber={invoice.invoiceNumber} initialNotes={invoice.notes} />
          </td>
        </tr>
      )}
    </>
  );
}
