import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function CrmOverview() {
  const { data } = useQuery({ queryKey: ['crm-deals'], queryFn: () => axios.get('/api/crm/deals').then(r => r.data) });
  const { data: leads = [] } = useQuery({ queryKey: ['crm-leads'], queryFn: () => axios.get('/api/crm/leads').then(r => r.data) });
  const STAGES = ['prospecting','qualification','proposal','negotiation','closed_won','closed_lost'];
  const stageTotals = (data as any)?.stage_totals || {};
  const pipeline = (data as any)?.total_pipeline || 0;
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">CRM Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-xs text-slate-500 uppercase">Total Pipeline</p><p className="text-3xl font-bold text-slate-900 mt-2">${pipeline.toLocaleString()}</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-xs text-slate-500 uppercase">Total Leads</p><p className="text-3xl font-bold text-slate-900 mt-2">{(leads as any[]).length}</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-xs text-slate-500 uppercase">Won Deals</p><p className="text-3xl font-bold text-emerald-600 mt-2">${(stageTotals['closed_won'] || 0).toLocaleString()}</p></div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Pipeline by Stage</h2>
        <div className="space-y-3">
          {STAGES.map(stage => (
            <div key={stage} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-28 capitalize">{stage.replace('_',' ')}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full"><div className="h-2 bg-indigo-500 rounded-full" style={{width:`${pipeline?Math.min((stageTotals[stage]||0)/pipeline*100,100):0}%`}} /></div>
              <span className="text-xs text-slate-700 w-20 text-right">${(stageTotals[stage]||0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
