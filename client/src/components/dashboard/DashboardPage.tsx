import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../../api/dashboard';
import StatCard from './StatCard';
import AgingChart from './AgingChart';
import StatusChart from './StatusChart';

function formatCurrency(amount: number) {
  return '₪' + amount.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    refetchInterval: 60_000,
  });

  if (isLoading) return <div className="text-center py-20 text-gray-500">טוען...</div>;
  if (error || !data) return <div className="text-center py-20 text-red-500">שגיאה בטעינת הנתונים</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">סקירה כללית</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="סה״כ חוב פתוח"
          value={formatCurrency(data.totalDebt)}
          color="blue"
          icon="💰"
        />
        <StatCard
          label="חשבוניות פתוחות"
          value={String(data.openInvoiceCount)}
          color="orange"
          icon="📄"
        />
        <StatCard
          label="לקוחות חייבים"
          value={String(data.customerCount)}
          color="purple"
          icon="👥"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">פיגור לפי גיל חוב</h3>
          <AgingChart data={data.agingBuckets} />
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">סטטוסי חשבוניות</h3>
          <StatusChart data={data.statusCounts} />
        </div>
      </div>
    </div>
  );
}
