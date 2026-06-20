import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Props { onClose: () => void; }

export default function AddEmployeeModal({ onClose }: Props) {
  const qc = useQueryClient();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', full_name: '', role: 'employee', department_id: '' });
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: () => axios.get('/api/hrms/departments').then(r => r.data) });
  const create = useMutation({ mutationFn: (data: any) => axios.post('/api/hrms/employees', data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); onClose(); } });
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold">Add Employee — Step {step}/2</h2><button onClick={onClose} className="text-slate-400 text-xl">&times;</button></div>
        <div className="flex gap-2 mb-6">{[1,2].map(s => <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-indigo-500' : 'bg-slate-200'}`} />)}</div>
        {step === 1 && (
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} /></div>
            <button onClick={() => setStep(2)} className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold">Next</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}>
                {['employee','manager','hr','finance','crm'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.department_id} onChange={e => setForm(f => ({...f, department_id: e.target.value}))}>
                <option value="">Select department</option>
                {(departments as any[]).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm">Back</button>
              <button onClick={() => create.mutate({...form, department_id: form.department_id ? parseInt(form.department_id) : undefined})} disabled={create.isPending} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60">{create.isPending ? 'Adding...' : 'Add Employee'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
