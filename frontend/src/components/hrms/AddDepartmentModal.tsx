import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Props { onClose: () => void; }

export default function AddDepartmentModal({ onClose }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', code: '', head_of_department_id: '' });
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: () => axios.get('/api/hrms/employees').then(r => r.data.data || r.data) });
  const create = useMutation({ mutationFn: (data: any) => axios.post('/api/hrms/departments', data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); onClose(); } });
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-semibold">Add Department</h2><button onClick={onClose} className="text-slate-400 text-xl">&times;</button></div>
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Department Name</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Code</label><input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. ENG" value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} /></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Head of Department</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" value={form.head_of_department_id} onChange={e => setForm(f => ({...f, head_of_department_id: e.target.value}))}>
              <option value="">Select employee</option>
              {(employees as any[]).map((emp: any) => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm">Cancel</button>
            <button onClick={() => create.mutate({...form, head_of_department_id: form.head_of_department_id ? parseInt(form.head_of_department_id) : undefined})} disabled={create.isPending} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60">{create.isPending ? 'Creating...' : 'Create'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
