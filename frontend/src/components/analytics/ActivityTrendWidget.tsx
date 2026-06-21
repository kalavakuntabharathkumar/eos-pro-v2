import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ActivityTrendWidget() {
  const { data = [] } = useQuery({ queryKey: ['analytics','trend'], queryFn: () => axios.get('/api/analytics/activity-trend').then(r => r.data) });
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Activity Trend (14 days)</h2>
      <ResponsiveContainer width="100%" height={200}><LineChart data={data as any[]}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="date" tick={{fontSize:10}} /><YAxis hide /><Tooltip /><Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
    </div>
  );
}
