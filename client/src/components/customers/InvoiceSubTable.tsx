import { useQuery } from '@tanstack/react-query';
import { getCustomer } from '../../api/customers';
import InvoiceRow from '../invoices/InvoiceRow';

interface Props {
  customerCode: string;
}

export default function InvoiceSubTable({ customerCode }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customer', customerCode],
    queryFn: () => getCustomer(customerCode),
    staleTime: 20_000,
  });

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">טוען חשבוניות...</div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 text-center text-red-500 text-sm">שגיאה בטעינת חשבוניות</div>
    );
  }

  const openInvoices = data.invoices.filter((inv) => !['שולם', 'בוטל'].includes(inv.status));
  const closedInvoices = data.invoices.filter((inv) => ['שולם', 'בוטל'].includes(inv.status));

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-100 border-b border-blue-200">
              <th className="px-4 py-2 text-right text-xs font-semibold text-blue-700">מספר חשבונית</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700">סכום</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-blue-700">תאריך פירעון</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-blue-700">פיגור</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-blue-700">סטטוס גבייה</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-blue-700">הערות</th>
            </tr>
          </thead>
          <tbody>
            {openInvoices.map((inv) => (
              <InvoiceRow key={inv.invoiceNumber} invoice={inv} />
            ))}
            {openInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-400 text-sm">
                  אין חשבוניות פתוחות
                </td>
              </tr>
            )}
            {closedInvoices.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-2 bg-gray-50 text-xs text-gray-500 font-medium border-t border-gray-200"
                  >
                    חשבוניות סגורות ({closedInvoices.length})
                  </td>
                </tr>
                {closedInvoices.map((inv) => (
                  <InvoiceRow key={inv.invoiceNumber} invoice={inv} />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
