import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const STATUSES = ['new','contacted','qualified','proposal','won','lost'];
const STATUS_COLORS: Record<string,string> = { new:'bg-slate-100 text-slate-600', contacted:'bg-blue-100 text-blue-700', qualified:'bg-indigo-100 text-indigo-700', proposal:'bg-amber-100 text-amber-700', won:'bg-emerald-100 text-emerald-700', lost:'bg-red-100 text-red-600' };

export default function Leads() {
  const { data: leads = [] } = useQuery({ queryKey: ['crm-leads'], queryFn: () => axios.get('/api/crm/leads').then(r => r.data) });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Leads</h1>
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {STATUSES.map(status => {
            const cols = (leads as any[]).filter((l: any) => l.status === status);
            return (
              <div key={status} className="w-56">
                <div className="flex items-center justify-between mb-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status]}`}>{status}</span><span className="text-xs text-slate-400">{cols.length}</span></div>
                <div className="space-y-2">
                  {cols.map((lead: any) => <div key={lead.id} className="bg-white rounded-lg border border-slate-200 p-3"><p className="text-sm font-medium text-slate-800">{lead.name}</p><p className="text-xs text-slate-500">{lead.company}</p>{lead.value>0&&<p className="text-xs font-medium text-indigo-600 mt-1">${lead.value.toLocaleString()}</p>}</div>)}
                  {!cols.length && <div className="h-16 rounded-lg border-2 border-dashed border-slate-100 flex items-center justify-center text-xs text-slate-300">Empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
