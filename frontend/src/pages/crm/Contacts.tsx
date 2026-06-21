import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Contacts() {
  const [search, setSearch] = useState('');
  const { data: contacts = [] } = useQuery({ queryKey: ['crm-contacts'], queryFn: () => axios.get('/api/crm/contacts').then(r => r.data) });
  const filtered = (contacts as any[]).filter((c: any) => c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase())).sort((a: any, b: any) => a.full_name?.localeCompare(b.full_name));
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Contacts</h1>
      <input type="text" placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200"><tr>{['Name','Email','Company','Position'].map(h => <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c: any) => <tr key={c.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-medium">{c.full_name}</td><td className="px-4 py-3 text-slate-500">{c.email}</td><td className="px-4 py-3">{c.company}</td><td className="px-4 py-3 text-slate-400">{c.position||'—'}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
