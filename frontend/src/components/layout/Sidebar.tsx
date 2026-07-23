import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { usePreferences } from "@/lib/preferences";
import {
  LayoutDashboard, Users, Briefcase, Package, CreditCard,
  Target, BarChart2, Bot, FolderOpen,
  Workflow, ChevronDown, ChevronRight,
  UserCheck, FileText, Receipt, LogOut,
  TrendingUp, ClipboardList, UserCircle, Shield,
  Clock, DollarSign,
  PanelLeftClose, PanelLeftOpen
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string }[];
  requiredPermission?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  requiredPermission?: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  employee: "Employee",
  super_admin: "Super Admin",
  hr_manager: "HR Manager",
  finance_manager: "Finance Manager",
  project_manager: "Project Manager",
  department_head: "Department Head",
};

function roleBadgeClass(role: string): string {
  if (role === "admin" || role === "super_admin") return "bg-indigo-500/15 text-indigo-400";
  if (role === "hr_manager" || role === "department_head") return "bg-amber-500/15 text-amber-400";
  if (role === "finance_manager") return "bg-emerald-500/15 text-emerald-400";
  if (role === "project_manager") return "bg-sky-500/15 text-sky-400";
  return "bg-white/10 text-white/50";
}

const ADMIN_NAV: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Modules",
    items: [
      {
        name: "HRMS",
        href: "/hrms",
        icon: Users,
        requiredPermission: "manage_employees",
        children: [
          { name: "Employees", href: "/hrms" },
          { name: "Attendance", href: "/hrms/attendance" },
          { name: "Leave Requests", href: "/hrms/leaves" },
        ],
      },
      {
        name: "CRM",
        href: "/crm",
        icon: Target,
        requiredPermission: "manage_settings",
        children: [
          { name: "Pipeline", href: "/crm" },
          { name: "Leads", href: "/crm/leads" },
          { name: "Contacts", href: "/crm/contacts" },
          { name: "Deals", href: "/crm/deals" },
        ],
      },
      {
        name: "ERP",
        href: "/erp",
        icon: Package,
        requiredPermission: "manage_settings",
        children: [
          { name: "Inventory", href: "/erp" },
          { name: "Vendors", href: "/erp/vendors" },
        ],
      },
      {
        name: "Finance",
        href: "/finance",
        icon: CreditCard,
        requiredPermission: "view_finance",
        children: [
          { name: "Overview", href: "/finance" },
          { name: "Invoices", href: "/finance/invoices" },
          { name: "Expenses", href: "/finance/expenses" },
        ],
      },
      {
        name: "Projects",
        href: "/projects",
        icon: FolderOpen,
        requiredPermission: "manage_projects",
      },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { name: "Analytics", href: "/analytics", icon: BarChart2, requiredPermission: "view_analytics" },
      { name: "Insights", href: "/ai", icon: Bot },
      { name: "Workflows", href: "/workflows", icon: Workflow, requiredPermission: "manage_settings" },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Documents", href: "/documents", icon: FileText },
    ],
  },
];

const EMPLOYEE_NAV: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "My Work",
    items: [
      { name: "My Projects", href: "/projects", icon: FolderOpen },
      { name: "My Leaves", href: "/my-leaves", icon: ClipboardList },
      { name: "Timesheets", href: "/timesheets", icon: Clock },
    ],
  },
  {
    title: "Resources",
    items: [
      { name: "Documents", href: "/documents", icon: FileText },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Insights", href: "/ai", icon: Bot },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "My Profile", href: "/profile", icon: UserCircle },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout, user, isEmployee, hasPermission, permissionsLoaded } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = usePreferences();
  const navigate = useNavigate();

  const useAdminNav = !isEmployee;

  const [expanded, setExpanded] = useState<string[]>(
    useAdminNav ? ["/hrms", "/crm", "/finance"] : []
  );

  const toggleExpand = (key: string) => {
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const filteredAdminNav: NavGroup[] = ADMIN_NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (!item.requiredPermission) return true;
      if (!permissionsLoaded) return false;
      return hasPermission(item.requiredPermission);
    }),
  })).filter((group) => group.items.length > 0);

  const navGroups = useAdminNav ? filteredAdminNav : EMPLOYEE_NAV;

  const isActive = (href: string) =>
    currentPath === href || (href !== "/" && currentPath.startsWith(href + "/"));

  const isGroupActive = (item: NavItem) =>
    isActive(item.href) || (item.children?.some((c) => isActive(c.href)) ?? false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const role = user?.role ?? "employee";
  const roleLabel = ROLE_LABELS[role] ?? role;

  const collapsed = sidebarCollapsed;

  return (
    <div className={cn(
      "bg-[#0f1117] text-white flex flex-col h-screen fixed top-0 left-0 z-40 transition-all duration-200",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo + collapse toggle */}
      <div className={cn("px-3 py-4 border-b border-white/5 flex items-center", collapsed ? "justify-center" : "justify-between px-5")}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg flex-shrink-0"
              style={{ backgroundImage: 'url(/logo.png)', backgroundSize: '300%', backgroundPosition: 'center 8%' }}
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white tracking-tight">Enterprise OS</p>
              <p className="text-[10px] text-white/30 tracking-wide">Unified Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex-shrink-0"
            style={{ backgroundImage: 'url(/logo.png)', backgroundSize: '300%', backgroundPosition: 'center 8%' }}
          />
        )}
        <button
          onClick={() => setSidebarCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "text-white/30 hover:text-white/70 transition-colors p-1 rounded",
            collapsed && "mt-0"
          )}
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-2 border-b border-white/5">
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold w-fit",
            roleBadgeClass(role)
          )}>
            {useAdminNav ? <Shield className="w-3 h-3" /> : <UserCircle className="w-3 h-3" />}
            {roleLabel}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-1.5">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isGroupActive(item);
                const isExpanded = expanded.includes(item.href);
                const hasChildren = item.children && item.children.length > 0;

                if (collapsed) {
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      title={item.name}
                      className={cn(
                        "flex items-center justify-center w-10 h-10 mx-auto rounded-lg text-sm transition-all duration-150",
                        isActive(item.href) || active
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  );
                }

                return (
                  <div key={item.href}>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleExpand(item.href)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left font-medium">{item.name}</span>
                        {isExpanded
                          ? <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                          : <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                        }
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                          isActive(item.href)
                            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                            : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )}

                    {hasChildren && isExpanded && (
                      <div className="ml-4 mt-0.5 pl-3 border-l border-white/8 space-y-0.5">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all duration-150",
                              isActive(child.href)
                                ? "text-indigo-400 font-semibold bg-indigo-600/10"
                                : "text-white/40 hover:text-white/70 hover:bg-white/5"
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User profile */}
      <div className="border-t border-white/5 p-3">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : initials}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm">
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">{user?.name ?? "Loading..."}</p>
              <p className="text-[10px] text-white/30 truncate">{roleLabel}</p>
            </div>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              title="Sign out"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400 text-white/30"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
