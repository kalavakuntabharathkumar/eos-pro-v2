import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Payslips() {
  const { data: payslips = [] } = useQuery({ queryKey: ['payslips'], queryFn: () => axios.get('/api/hrms/payslips').then(r => r.data) });
  const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">My Payslips</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(payslips as any[]).map((ps: any) => (
          <div key={ps.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div><p className="font-semibold text-slate-800">{months[ps.month]} {ps.year}</p><p className="text-xs text-slate-400 mt-0.5">Payslip #{ps.id}</p></div>
              <span className="text-xl font-bold text-indigo-600">${ps.net_salary?.toLocaleString()}</span>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <div className="flex justify-between"><span>Basic</span><span>${ps.basic_salary?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Allowances</span><span>+${ps.allowances?.toLocaleString()}</span></div>
              <div className="flex justify-between text-red-500"><span>Deductions</span><span>-${ps.deductions?.toLocaleString()}</span></div>
            </div>
            <button className="mt-3 w-full text-xs text-indigo-600 border border-indigo-200 rounded-lg py-1.5 hover:bg-indigo-50">Download PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}
