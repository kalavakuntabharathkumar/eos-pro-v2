import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => axios.get('/api/notifications').then(r => r.data),
    refetchInterval: 30_000,
  });
  const unread = (notifications as any[]).filter((n: any) => !n.is_read).length;
  const markRead = useMutation({ mutationFn: (id: number) => axios.patch(`/api/notifications/${id}/read`), onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) });
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-slate-100">
        <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z" />
        </svg>
        {unread > 0 && <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
            {unread > 0 && <span className="text-xs text-indigo-600">{unread} new</span>}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {(notifications as any[]).length === 0 ? <p className="text-sm text-slate-400 text-center py-8">No notifications</p> : (
              (notifications as any[]).slice(0, 10).map((n: any) => (
                <div key={n.id} onClick={() => markRead.mutate(n.id)}
                  className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${!n.is_read ? 'bg-indigo-50/50' : ''}`}>
                  <p className="text-sm font-medium text-slate-800">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
