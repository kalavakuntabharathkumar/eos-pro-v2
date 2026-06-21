import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function Support() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', priority:'medium' });
  const { data: tickets = [] } = useQuery({ queryKey: ['support-tickets'], queryFn: () => axios.get('/api/support/tickets').then(r => r.data) });
  const create = useMutation({ mutationFn: (d: any) => axios.post('/api/support/tickets', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['support-tickets'] }); setShowForm(false); setForm({title:'',description:'',priority:'medium'}); } });
  const close = useMutation({ mutationFn: (id: number) => axios.patch(`/api/support/tickets/${id}/close`), onSuccess: () => qc.invalidateQueries({ queryKey: ['support-tickets'] }) });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-slate-900">Support</h1><button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg">New Ticket</button></div>
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div><label className="text-xs font-medium text-slate-600 mb-1 block">Title</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} /></div>
          <div><label className="text-xs font-medium text-slate-600 mb-1 block">Description</label><textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} /></div>
          <div><label className="text-xs font-medium text-slate-600 mb-1 block">Priority</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.priority} onChange={e => setForm(f=>({...f,priority:e.target.value}))}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          <button onClick={() => create.mutate(form)} disabled={create.isPending} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg">{create.isPending?'Submitting...':'Submit'}</button>
        </div>
      )}
      <div className="space-y-3">
        {(tickets as any[]).map((t: any) => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${t.priority==='high'?'bg-red-100 text-red-700':t.priority==='medium'?'bg-amber-100 text-amber-700':'bg-slate-100 text-slate-600'}`}>{t.priority}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${t.status==='open'?'bg-blue-100 text-blue-700':'bg-slate-100 text-slate-600'}`}>{t.status}</span>
                </div>
                <h3 className="font-semibold text-slate-800">{t.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{t.description}</p>
                <p className="text-xs text-slate-400 mt-2">{t.created_at?new Date(t.created_at).toLocaleString():'—'}</p>
              </div>
              {t.status!=='closed'&&<button onClick={() => close.mutate(t.id)} className="text-xs text-slate-500 border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-50 shrink-0 ml-3">Close</button>}
            </div>
          </div>
        ))}
        {!(tickets as any[]).length&&<p className="text-center text-sm text-slate-400 py-8">No tickets yet</p>}
      </div>
    </div>
  );
}
