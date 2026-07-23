import React from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { User2, Mail, Shield, Briefcase, Calendar, UserCircle } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const ROLE_LABELS: Record<string, string> = {
    admin: "Administrator",
    employee: "Employee",
    super_admin: "Super Admin",
    hr_manager: "HR Manager",
    finance_manager: "Finance Manager",
    project_manager: "Project Manager",
    department_head: "Department Head",
  };

  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : "—";

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
              : initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name ?? "—"}</h2>
            <p className="text-indigo-200 text-sm mt-0.5">{roleLabel}</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{user?.email ?? "—"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{roleLabel}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <UserCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>Manage your account details through your HR representative.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
