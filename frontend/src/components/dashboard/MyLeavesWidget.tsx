import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function MyLeavesWidget() {
  const { data: leaves = [] } = useQuery({
    queryKey: ['leaves', 'mine'],
    queryFn: () => axios.get('/api/hrms/leaves').then(r => r.data),
  });
  const stats = {
    pending: (leaves as any[]).filter((l: any) => l.status === 'pending').length,
    approved: (leaves as any[]).filter((l: any) => l.status === 'approved').length,
    total: (leaves as any[]).length,
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">My Leave Balance</h2>
      <div className="grid grid-cols-3 gap-3">
        {[{label:'Total',value:stats.total,color:'bg-slate-50'},{label:'Approved',value:stats.approved,color:'bg-emerald-50'},{label:'Pending',value:stats.pending,color:'bg-amber-50'}].map(s => (
          <div key={s.label} className={`${s.color} rounded-lg p-3 text-center`}>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
