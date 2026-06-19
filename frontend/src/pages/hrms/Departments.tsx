import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Departments() {
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: () => axios.get('/api/hrms/departments').then(r => r.data) });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Departments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(departments as any[]).map((dept: any) => (
          <div key={dept.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">{dept.code}</div>
              <span className="text-xs text-slate-400">{dept.employee_count || 0} members</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-800">{dept.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
