import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Props { onClose: () => void; }

export default function AddLeadModal({ onClose }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name:'', email:'', company:'', phone:'', status:'new', value:'' });
  const create = useMutation({ mutationFn: (data: any) => axios.post('/api/crm/leads', data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['crm-leads'] }); onClose(); } });
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-semibold">Add Lead</h2><button onClick={onClose} className="text-slate-400 text-xl">&times;</button></div>
        <div className="space-y-4">
          {[['Name','name'],['Email','email'],['Company','company'],['Phone','phone']].map(([label,key]) => (
            <div key={key}><label className="block text-xs font-medium text-slate-700 mb-1">{label}</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={(form as any)[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} /></div>
          ))}
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Deal Value ($)</label><input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.value} onChange={e => setForm(f => ({...f,value:e.target.value}))} /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm">Cancel</button>
            <button onClick={() => create.mutate({...form,value:parseFloat(form.value)||0})} disabled={create.isPending} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60">{create.isPending?'Adding...':'Add Lead'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
