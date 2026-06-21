import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function FinanceAnalyticsWidget() {
  const { data } = useQuery({ queryKey: ['analytics','finance'], queryFn: () => axios.get('/api/analytics/finance').then(r => r.data) });
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Finance Analytics</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-400">Total Revenue</p><p className="text-xl font-bold text-emerald-600 mt-1">${((data as any)?.summary?.total_revenue||0).toLocaleString()}</p></div>
        <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-400">Approval Rate</p><p className="text-xl font-bold text-indigo-600 mt-1">{(data as any)?.expense_approval_rate?.rate||0}%</p></div>
      </div>
    </div>
  );
}
