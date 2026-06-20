import { useState } from 'react';

const SAMPLE = [
  { id: 1, name: 'Leave Approval Notifier', trigger: 'leave_approved', is_active: true, steps: 3 },
  { id: 2, name: 'New Employee Onboarding', trigger: 'employee_created', is_active: true, steps: 5 },
  { id: 3, name: 'Invoice Paid Confirmation', trigger: 'invoice_paid', is_active: false, steps: 2 },
];

export default function Workflows() {
  const [selected, setSelected] = useState<any>(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Workflows</h1>
        <button onClick={() => setSelected({})} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg">New Workflow</button>
      </div>
      <div className="grid gap-3">
        {SAMPLE.map(wf => (
          <div key={wf.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
            <div><h3 className="font-semibold text-slate-800">{wf.name}</h3><p className="text-xs text-slate-400 mt-1">Trigger: {wf.trigger} · {wf.steps} steps</p></div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded-full text-xs ${wf.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{wf.is_active ? 'Active' : 'Inactive'}</span>
              <button onClick={() => setSelected(wf)} className="text-xs text-indigo-600 hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
