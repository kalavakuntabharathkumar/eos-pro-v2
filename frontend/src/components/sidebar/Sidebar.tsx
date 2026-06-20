import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', roles: ['admin','hr','manager','employee','finance','crm'] },
  { label: 'Employees', path: '/hrms/employees', roles: ['admin','hr','manager','employee'] },
  { label: 'My Leaves', path: '/my-leaves', roles: ['employee'] },
  { label: 'CRM', path: '/crm', roles: ['admin','crm','manager'] },
  { label: 'Finance', path: '/finance', roles: ['admin','finance'] },
  { label: 'ERP', path: '/erp', roles: ['admin'] },
  { label: 'Projects', path: '/projects', roles: ['admin','manager','employee'] },
  { label: 'Analytics', path: '/analytics', roles: ['admin','hr','manager','finance'] },
  { label: 'Documents', path: '/documents', roles: ['admin','hr','manager','employee'] },
  { label: 'AI Assistant', path: '/ai', roles: ['admin','hr','manager','employee','finance','crm'] },
  { label: 'Support', path: '/support', roles: ['admin','hr','manager','employee','finance','crm'] },
];

interface Props { open: boolean; onClose: () => void; }

export default function Sidebar({ open }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role || 'employee';
  const visible = NAV_ITEMS.filter(i => i.roles.includes(role));

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className={clsx('flex flex-col bg-slate-900 text-slate-300 transition-all duration-200 shrink-0 lg:w-60',
      open ? 'w-60' : 'w-0 overflow-hidden')}>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/50">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">EO</span>
        </div>
        <span className="font-semibold text-white text-sm">Enterprise OS</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
        {visible.map(item => (
          <NavLink key={item.path} to={item.path}
            className={clsx('flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive(item.path) ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-white')}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">{user?.full_name?.[0]}</div>
          <span className="truncate">{user?.full_name}</span>
        </div>
      </div>
    </aside>
  );
}
