import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Props { onClose: () => void; }

export default function AddDealModal({ onClose }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title:'', value:'', stage:'prospecting', contact_id:'' });
  const { data: contacts = [] } = useQuery({ queryKey: ['crm-contacts'], queryFn: () => axios.get('/api/crm/contacts').then(r => r.data) });
  const create = useMutation({ mutationFn: (data: any) => axios.post('/api/crm/deals', data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['crm-deals'] }); onClose(); } });
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-semibold">Add Deal</h2><button onClick={onClose} className="text-slate-400 text-xl">&times;</button></div>
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Deal Title</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Value ($)</label><input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.value} onChange={e => setForm(f=>({...f,value:e.target.value}))} /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Contact</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.contact_id} onChange={e => setForm(f=>({...f,contact_id:e.target.value}))}>
              <option value="">Select contact</option>
              {(contacts as any[]).map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm">Cancel</button>
            <button onClick={() => create.mutate({...form,value:parseFloat(form.value)||0,contact_id:parseInt(form.contact_id)})} disabled={create.isPending} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60">{create.isPending?'Creating...':'Create Deal'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
