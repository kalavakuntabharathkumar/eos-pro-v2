import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function HRAnalyticsWidget() {
  const { data } = useQuery({ queryKey: ['analytics','hr'], queryFn: () => axios.get('/api/analytics/hr').then(r => r.data) });
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">HR Analytics</h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-400">Attendance Rate</p><p className="text-xl font-bold text-indigo-600 mt-1">{data?.attendance_rate||0}%</p></div>
        <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-400">New Hires (30d)</p><p className="text-xl font-bold text-emerald-600 mt-1">{data?.new_hires||0}</p></div>
      </div>
      {data?.departments && <ResponsiveContainer width="100%" height={160}><BarChart data={data.departments}><XAxis dataKey="department" tick={{fontSize:10}} /><YAxis hide /><Tooltip /><Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>}
    </div>
  );
}
