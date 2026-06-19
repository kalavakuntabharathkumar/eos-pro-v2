import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function ExpenseSummaryWidget() {
  const { data = {} } = useQuery({ queryKey: ['expenses'], queryFn: () => axios.get('/api/finance/expenses').then(r => r.data) });
  const total = (data as any).total || 0;
  const pending = ((data as any).expenses || []).filter((e: any) => e.status === 'pending').length;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Expense Summary</h2>
      <div className="flex items-end gap-3">
        <div>
          <p className="text-3xl font-bold text-slate-900">${total.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Total submitted</p>
        </div>
        <span className="text-sm text-amber-600 font-medium mb-1">{pending} pending</span>
      </div>
    </div>
  );
}
