import { Link } from 'react-router-dom';
export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="text-6xl font-bold text-red-400 mb-4">403</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500 mb-6">You don't have permission to view this page.</p>
        <Link to="/dashboard" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700">Back to Dashboard</Link>
      </div>
    </div>
  );
}
