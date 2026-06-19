import { useAuth } from '../../context/AuthContext';

interface Props { roles: string[]; children: React.ReactNode; fallback?: React.ReactNode; }

export default function RoleGuard({ roles, children, fallback = null }: Props) {
  const { user } = useAuth();
  if (!user) return <>{fallback}</>;
  return <>{roles.includes(user.role) ? children : fallback}</>;
}
