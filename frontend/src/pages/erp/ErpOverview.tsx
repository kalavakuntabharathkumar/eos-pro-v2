import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function ErpOverview() {
  const { data: vendors = [] } = useQuery({ queryKey: ['vendors'], queryFn: () => axios.get('/api/erp/vendors').then(r => r.data) });
  const { data: pos = [] } = useQuery({ queryKey: ['pos'], queryFn: () => axios.get('/api/erp/purchase-orders').then(r => r.data) });
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: () => axios.get('/api/erp/products').then(r => r.data) });
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">ERP Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-xs text-slate-500 uppercase">Vendors</p><p className="text-3xl font-bold text-slate-900 mt-2">{(vendors as any[]).length}</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-xs text-slate-500 uppercase">Purchase Orders</p><p className="text-3xl font-bold text-slate-900 mt-2">{(pos as any[]).length}</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-xs text-slate-500 uppercase">Products</p><p className="text-3xl font-bold text-slate-900 mt-2">{(products as any[]).length}</p></div>
      </div>
    </div>
  );
}
