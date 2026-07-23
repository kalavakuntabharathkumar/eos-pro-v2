import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { PreferencesProvider } from "@/lib/preferences";
import { AdminGuard } from "@/components/RoleGuard";
import { PermissionGuard } from "@/components/PermissionGuard";

import LoginPage from "@/pages/login";
import AccessDeniedPage from "@/pages/access-denied";
import Dashboard from "@/pages/dashboard";
import EmployeesPage from "@/pages/hrms";
import EmployeeDetailPage from "@/pages/hrms/employees/[id]";
import AttendancePage from "@/pages/hrms/attendance";
import LeavesPage from "@/pages/hrms/leaves";
import CRMPage from "@/pages/crm";
import LeadsPage from "@/pages/crm/leads";
import ContactsPage from "@/pages/crm/contacts";
import DealsKanbanPage from "@/pages/crm/deals";
import InventoryPage from "@/pages/erp";
import VendorsPage from "@/pages/erp/vendors";
import FinanceDashboard from "@/pages/finance";
import InvoicesPage from "@/pages/finance/invoices";
import ExpensesPage from "@/pages/finance/expenses";
import ProjectsPage from "@/pages/projects";
import ProjectDetailPage from "@/pages/projects/[id]";
import AnalyticsPage from "@/pages/analytics";
import AiCopilotPage from "@/pages/ai";
import WorkflowsPage from "@/pages/workflows";

import MyLeavesPage from "@/pages/my-leaves";
import ProfilePage from "@/pages/profile";
import TimesheetsPage from "@/pages/timesheets";
import DocumentsPage from "@/pages/documents";

import { AppLayout } from "@/components/layout/AppLayout";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <PreferencesProvider>
          <AuthProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/access-denied" element={<AccessDeniedPage />} />
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* HRMS — requires manage_employees permission */}
                  <Route path="hrms">
                    <Route index element={<PermissionGuard permission="manage_employees"><EmployeesPage /></PermissionGuard>} />
                    <Route path="employees/:id" element={<PermissionGuard permission="manage_employees"><EmployeeDetailPage /></PermissionGuard>} />
                    <Route path="attendance" element={<PermissionGuard permission="manage_employees"><AttendancePage /></PermissionGuard>} />
                    <Route path="leaves" element={<LeavesPage />} />
                  </Route>

                  {/* CRM — admin only */}
                  <Route path="crm">
                    <Route index element={<AdminGuard><CRMPage /></AdminGuard>} />
                    <Route path="leads" element={<AdminGuard><LeadsPage /></AdminGuard>} />
                    <Route path="contacts" element={<AdminGuard><ContactsPage /></AdminGuard>} />
                    <Route path="deals" element={<AdminGuard><DealsKanbanPage /></AdminGuard>} />
                  </Route>

                  {/* ERP — admin only */}
                  <Route path="erp">
                    <Route index element={<AdminGuard><InventoryPage /></AdminGuard>} />
                    <Route path="vendors" element={<AdminGuard><VendorsPage /></AdminGuard>} />
                  </Route>

                  {/* Finance — requires view_finance permission */}
                  <Route path="finance">
                    <Route index element={<PermissionGuard permission="view_finance"><FinanceDashboard /></PermissionGuard>} />
                    <Route path="invoices" element={<PermissionGuard permission="view_finance"><InvoicesPage /></PermissionGuard>} />
                    <Route path="expenses" element={<PermissionGuard permission="view_finance"><ExpensesPage /></PermissionGuard>} />
                  </Route>

                  {/* Projects — accessible to all authenticated users */}
                  <Route path="projects">
                    <Route index element={<ProjectsPage />} />
                    <Route path=":id" element={<ProjectDetailPage />} />
                  </Route>

                  {/* Analytics */}
                  <Route path="analytics" element={<AnalyticsPage />} />

                  {/* Workflows — admin only */}
                  <Route path="workflows" element={<AdminGuard><WorkflowsPage /></AdminGuard>} />

                  {/* Accessible to all authenticated users */}
                  <Route path="ai" element={<AiCopilotPage />} />

                  {/* Employee experience modules */}
                  <Route path="my-leaves" element={<MyLeavesPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="timesheets" element={<TimesheetsPage />} />
                  <Route path="documents" element={<DocumentsPage />} />

                  <Route path="*" element={<div className="p-8 text-gray-500">Page not found</div>} />
                </Route>
              </Routes>
            </BrowserRouter>
            <Toaster />
          </AuthProvider>
          </PreferencesProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
