import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Attendance() {
  const { data: records = [] } = useQuery({ queryKey: ['attendance'], queryFn: () => axios.get('/api/hrms/attendance').then(r => r.data) });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Attendance</h1>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200"><tr>{['Employee','Date','Check In','Check Out','Status'].map(h => <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {(records as any[]).map((r: any) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-600">#{r.employee_id}</td>
                <td className="px-4 py-3">{r.date ? new Date(r.date).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3 text-emerald-700">{r.check_in ? new Date(r.check_in).toLocaleTimeString() : '—'}</td>
                <td className="px-4 py-3 text-rose-600">{r.check_out ? new Date(r.check_out).toLocaleTimeString() : '—'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${r.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
