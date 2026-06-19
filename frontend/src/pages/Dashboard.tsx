import KpiCard from '../components/dashboard/KpiCard';
import WorkforceWidget from '../components/dashboard/WorkforceWidget';
import PendingLeavesWidget from '../components/dashboard/PendingLeavesWidget';
import MyLeavesWidget from '../components/dashboard/MyLeavesWidget';
import ExpenseSummaryWidget from '../components/dashboard/ExpenseSummaryWidget';
import TeamWidget from '../components/dashboard/TeamWidget';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Organization overview at a glance</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Employees" value="248" trend={4} icon="users" />
        <KpiCard label="Open Leaves" value="12" trend={-2} icon="calendar" />
        <KpiCard label="Active Projects" value="31" trend={6} icon="folder" />
        <KpiCard label="Open Tickets" value="7" trend={-1} icon="ticket" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkforceWidget />
        <PendingLeavesWidget />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MyLeavesWidget />
        <ExpenseSummaryWidget />
        <TeamWidget />
      </div>
    </div>
  );
}
