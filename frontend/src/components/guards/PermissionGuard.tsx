import { useAuth } from '../../context/AuthContext';

const PERMISSIONS: Record<string, string[]> = {
  admin: ['*'],
  hr: ['hrms:read','hrms:write','analytics:read','documents:read','documents:write'],
  manager: ['hrms:read','hrms:write','projects:read','projects:write','analytics:read','documents:read'],
  employee: ['hrms:read','projects:read','documents:read'],
  finance: ['finance:read','finance:write','analytics:read','documents:read'],
  crm: ['crm:read','crm:write','analytics:read'],
};

interface Props { permission: string; children: React.ReactNode; fallback?: React.ReactNode; }

export default function PermissionGuard({ permission, children, fallback = null }: Props) {
  const { user } = useAuth();
  if (!user) return <>{fallback}</>;
  const perms = PERMISSIONS[user.role] || [];
  return <>{(perms.includes('*') || perms.includes(permission)) ? children : fallback}</>;
}
