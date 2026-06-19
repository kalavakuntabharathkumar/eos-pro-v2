import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function TeamWidget() {
  const { data: res = {} } = useQuery({ queryKey: ['employees'], queryFn: () => axios.get('/api/hrms/employees').then(r => r.data) });
  const employees: any[] = (res as any).data || [];
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Team Members</h2>
      <div className="space-y-2">
        {employees.slice(0, 6).map((emp: any) => (
          <div key={emp.id} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">{emp.full_name?.[0]}</div>
            <div><p className="text-sm font-medium text-slate-800">{emp.full_name}</p><p className="text-xs text-slate-400 capitalize">{emp.role}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
