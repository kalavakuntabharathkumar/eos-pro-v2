import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Vendors() {
  const { data: vendors = [] } = useQuery({ queryKey: ['vendors'], queryFn: () => axios.get('/api/erp/vendors').then(r => r.data) });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Vendors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(vendors as any[]).map((v: any) => (
          <div key={v.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-slate-800">{v.name}</h3><span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{v.category}</span></div>
            <p className="text-sm text-slate-500">{v.contact_email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
