import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function WorkforceWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'hr'],
    queryFn: () => axios.get('/api/analytics/hr').then(r => r.data),
  });
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">Workforce by Department</h2>
      {isLoading ? <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-5 bg-slate-100 rounded animate-pulse" />)}</div> : (
        <div className="space-y-3">
          {(data?.departments || []).map((dept: { department: string; count: number }) => (
            <div key={dept.department} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{dept.department}</span>
              <div className="flex items-center gap-3">
                <div className="h-2 bg-indigo-100 rounded-full overflow-hidden w-32">
                  <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${Math.min((dept.count / 80) * 100, 100)}%` }} />
                </div>
                <span className="text-sm font-medium text-slate-800 w-8 text-right">{dept.count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
