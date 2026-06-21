import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function Purchases() {
  const qc = useQueryClient();
  const { data: pos = [] } = useQuery({ queryKey: ['pos'], queryFn: () => axios.get('/api/erp/purchase-orders').then(r => r.data) });
  const approve = useMutation({ mutationFn: (id: number) => axios.patch(`/api/erp/purchase-orders/${id}/approve`), onSuccess: () => qc.invalidateQueries({ queryKey: ['pos'] }) });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Purchase Orders</h1>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200"><tr>{['PO Number','Amount','Status','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {(pos as any[]).map((po: any) => (
              <tr key={po.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{po.po_number}</td>
                <td className="px-4 py-3">${po.total_amount?.toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs capitalize ${po.status==='approved'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{po.status}</span></td>
                <td className="px-4 py-3">{po.status==='pending'&&<button onClick={() => approve.mutate(po.id)} className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">Approve</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
