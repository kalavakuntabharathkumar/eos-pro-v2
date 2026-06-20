import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function MyLeaves() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ leave_type: 'Annual', start_date: '', end_date: '', reason: '' });
  const { data: leaves = [] } = useQuery({ queryKey: ['leaves', 'mine'], queryFn: () => axios.get('/api/hrms/leaves').then(r => r.data) });
  const submit = useMutation({ mutationFn: (data: any) => axios.post('/api/hrms/leaves', data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['leaves'] }); setShowForm(false); } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">My Leaves</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg">Request Leave</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-slate-600 mb-1 block">Type</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.leave_type} onChange={e => setForm(f=>({...f, leave_type: e.target.value}))}>
                {['Annual','Sick','Personal','Emergency'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-medium text-slate-600 mb-1 block">Start Date</label><input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.start_date} onChange={e => setForm(f=>({...f, start_date: e.target.value}))} /></div>
            <div><label className="text-xs font-medium text-slate-600 mb-1 block">End Date</label><input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.end_date} onChange={e => setForm(f=>({...f, end_date: e.target.value}))} /></div>
            <div><label className="text-xs font-medium text-slate-600 mb-1 block">Reason</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.reason} onChange={e => setForm(f=>({...f, reason: e.target.value}))} /></div>
          </div>
          <button onClick={() => submit.mutate(form)} disabled={submit.isPending} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg">{submit.isPending ? 'Submitting...' : 'Submit'}</button>
        </div>
      )}
      <div className="space-y-2">
        {(leaves as any[]).map((l: any) => (
          <div key={l.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-800">{l.leave_type} Leave</p><p className="text-xs text-slate-500 mt-0.5">{l.reason}</p></div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${l.status==='approved'?'bg-emerald-100 text-emerald-700':l.status==='rejected'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{l.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
