import type { Customer } from '../../types';
import CustomerRow from './CustomerRow';

interface Props {
  customers: Customer[];
}

export default function CustomerTable({ customers }: Props) {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
        לא נמצאו לקוחות עם חשבוניות פתוחות
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="w-10"></th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">קוד לקוח</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">שם לקוח</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">איש קשר</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">סה״כ חוב</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">גיל חוב</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">חשבוניות</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <CustomerRow key={customer.priorityCode} customer={customer} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
