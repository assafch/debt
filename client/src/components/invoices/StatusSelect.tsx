import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInvoiceStatus } from '../../api/invoices';
import { PAYMENT_STATUSES } from '../../types';

interface Props {
  invoiceNumber: string;
  currentStatus: string;
}

export default function StatusSelect({ invoiceNumber, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStatus: string) => updateInvoiceStatus(invoiceNumber, newStatus),
    onSuccess: (updated) => {
      setStatus(updated.status);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const statusDef = PAYMENT_STATUSES.find((s) => s.value === status);
  const colorClass = statusDef?.color ?? 'bg-gray-100 text-gray-600';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation();
    const newStatus = e.target.value;
    setStatus(newStatus);
    mutation.mutate(newStatus);
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      disabled={mutation.isPending}
      className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 ${colorClass} ${
        mutation.isPending ? 'opacity-50' : ''
      }`}
    >
      {PAYMENT_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
