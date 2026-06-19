import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700', hr: 'bg-blue-100 text-blue-700',
  manager: 'bg-indigo-100 text-indigo-700', employee: 'bg-slate-100 text-slate-700',
  finance: 'bg-emerald-100 text-emerald-700', crm: 'bg-orange-100 text-orange-700',
};

export default function Employees() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['employees', search, page],
    queryFn: () => axios.get('/api/hrms/employees', { params: { search, skip: (page-1)*20, limit: 20 } }).then(r => r.data),
  });
  const employees: any[] = data?.data || [];
  const total: number = data?.total || 0;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Employees</h1>
      <input type="text" placeholder="Search employees..." value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Name','Email','Role','Status'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>) :
              employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3"><Link to={`/hrms/employees/${emp.id}`} className="font-medium text-indigo-600 hover:underline">{emp.full_name}</Link></td>
                  <td className="px-4 py-3 text-slate-600">{emp.email}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_COLORS[emp.role] || 'bg-slate-100 text-slate-600'}`}>{emp.role}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${emp.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{emp.is_active ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>{total} employees</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40">Prev</button>
            <button disabled={employees.length < 20} onClick={() => setPage(p => p+1)} className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
