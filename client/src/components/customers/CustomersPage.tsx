import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../../api/customers';
import CustomerFilters from './CustomerFilters';
import CustomerTable from './CustomerTable';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAging, setSelectedAging] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', { search, statuses: selectedStatuses, aging: selectedAging }],
    queryFn: () =>
      getCustomers({
        search: search || undefined,
        status: selectedStatuses.length ? selectedStatuses : undefined,
        aging: selectedAging.length ? selectedAging : undefined,
        limit: 200,
      }),
    staleTime: 20_000,
  });

  const handleSearchChange = useCallback((val: string) => setSearch(val), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">לקוחות עם חשבוניות פתוחות</h2>
        {data && (
          <span className="text-sm text-gray-500">{data.total} לקוחות</span>
        )}
      </div>

      <CustomerFilters
        search={search}
        onSearchChange={handleSearchChange}
        selectedStatuses={selectedStatuses}
        onStatusChange={setSelectedStatuses}
        selectedAging={selectedAging}
        onAgingChange={setSelectedAging}
      />

      {isLoading && (
        <div className="text-center py-20 text-gray-500">טוען...</div>
      )}
      {error && (
        <div className="text-center py-20 text-red-500">שגיאה בטעינת הנתונים</div>
      )}
      {data && (
        <CustomerTable customers={data.data} />
      )}
    </div>
  );
}
