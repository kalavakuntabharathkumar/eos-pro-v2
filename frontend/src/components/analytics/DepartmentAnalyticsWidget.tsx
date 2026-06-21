import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DepartmentAnalyticsWidget() {
  const { data = [] } = useQuery({ queryKey: ['analytics','dept'], queryFn: () => axios.get('/api/analytics/departments').then(r => r.data) });
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Department Activity</h2>
      <ResponsiveContainer width="100%" height={200}><BarChart data={data as any[]}><XAxis dataKey="department" tick={{fontSize:10}} /><YAxis hide /><Tooltip /><Bar dataKey="activity_count" fill="#8b5cf6" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
    </div>
  );
}
