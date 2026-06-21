import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function DocumentStatsWidget() {
  const { data } = useQuery({ queryKey: ['analytics','docs'], queryFn: () => axios.get('/api/analytics/documents').then(r => r.data) });
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Document Statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center"><p className="text-2xl font-bold text-slate-900">{(data as any)?.stats?.total_documents||0}</p><p className="text-xs text-slate-400 mt-1">Total</p></div>
        <div className="text-center"><p className="text-2xl font-bold text-indigo-600">{(data as any)?.stats?.recent_uploads||0}</p><p className="text-xs text-slate-400 mt-1">Uploaded (30d)</p></div>
        <div className="text-center"><p className="text-2xl font-bold text-emerald-600">{Math.round(((data as any)?.stats?.total_size_bytes||0)/1024/1024)} MB</p><p className="text-xs text-slate-400 mt-1">Size</p></div>
      </div>
    </div>
  );
}
