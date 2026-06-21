import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Analytics() {
  const { data: hrData } = useQuery({ queryKey: ['analytics','hr'], queryFn: () => axios.get('/api/analytics/hr').then(r => r.data) });
  const { data: trend = [] } = useQuery({ queryKey: ['analytics','trend'], queryFn: () => axios.get('/api/analytics/activity-trend').then(r => r.data) });
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-xs text-slate-500 uppercase">Attendance Rate</p><p className="text-3xl font-bold text-indigo-600 mt-2">{hrData?.attendance_rate||0}%</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-xs text-slate-500 uppercase">New Hires (30d)</p><p className="text-3xl font-bold text-emerald-600 mt-2">{hrData?.new_hires||0}</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-xs text-slate-500 uppercase">Leave Requests</p><p className="text-3xl font-bold text-slate-900 mt-2">{hrData?.leaves?.total||0}</p></div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Activity Trend (14 days)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trend as any[]}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="date" tick={{fontSize:10}} /><YAxis hide /><Tooltip /><Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} /></LineChart>
        </ResponsiveContainer>
      </div>
      {hrData?.departments && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Headcount by Department</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hrData.departments}><XAxis dataKey="department" tick={{fontSize:10}} /><YAxis hide /><Tooltip /><Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
