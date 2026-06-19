import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Login';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<div className="p-4 text-slate-600">Dashboard loading...</div>} />
        <Route path="hrms/*" element={<div className="p-4 text-slate-600">HRMS</div>} />
        <Route path="crm/*" element={<div className="p-4 text-slate-600">CRM</div>} />
        <Route path="finance/*" element={<div className="p-4 text-slate-600">Finance</div>} />
        <Route path="erp/*" element={<div className="p-4 text-slate-600">ERP</div>} />
        <Route path="projects/*" element={<div className="p-4 text-slate-600">Projects</div>} />
        <Route path="analytics" element={<div className="p-4 text-slate-600">Analytics</div>} />
        <Route path="documents" element={<div className="p-4 text-slate-600">Documents</div>} />
        <Route path="ai" element={<div className="p-4 text-slate-600">AI Assistant</div>} />
        <Route path="support" element={<div className="p-4 text-slate-600">Support</div>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
