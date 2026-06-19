import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<'profile' | 'leaves'>('profile');
  const { data: emp } = useQuery({ queryKey: ['employee', id], queryFn: () => axios.get(`/api/hrms/employees/${id}`).then(r => r.data) });
  const { data: leaves = [] } = useQuery({ queryKey: ['leaves', 'employee', id], queryFn: () => axios.get('/api/hrms/leaves').then(r => r.data.filter((l: any) => String(l.employee_id) === id)), enabled: tab === 'leaves' });
  if (!emp) return <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />;
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">{emp.full_name?.[0]}</div>
          <div><h1 className="text-xl font-bold text-slate-900">{emp.full_name}</h1><p className="text-slate-500 text-sm">{emp.email}</p></div>
        </div>
      </div>
      <div className="flex gap-2 border-b border-slate-200">
        {(['profile','leaves'] as const).map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}>{t}</button>)}
      </div>
      {tab === 'profile' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-400">Email</span><p className="font-medium mt-1">{emp.email}</p></div>
          <div><span className="text-slate-400">Role</span><p className="font-medium mt-1 capitalize">{emp.role}</p></div>
          <div><span className="text-slate-400">Status</span><p className="font-medium mt-1">{emp.is_active ? 'Active' : 'Inactive'}</p></div>
        </div>
      )}
      {tab === 'leaves' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm"><thead className="bg-slate-50"><tr>{['Type','Status','Reason'].map(h => <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">{(leaves as any[]).map((l: any) => <tr key={l.id}><td className="px-4 py-3">{l.leave_type}</td><td className="px-4 py-3 capitalize">{l.status}</td><td className="px-4 py-3 text-slate-500">{l.reason}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
