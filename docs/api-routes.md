# API Routes Reference

## Auth
- POST /api/auth/login         – Login, get JWT pair
- POST /api/auth/register      – Create account
- POST /api/auth/refresh       – Refresh access token
- GET  /api/auth/me            – Get current user

## HRMS
- GET/POST       /api/hrms/employees
- GET/PUT/DELETE /api/hrms/employees/{id}
- GET/POST       /api/hrms/departments
- GET/POST       /api/hrms/leaves
- PATCH          /api/hrms/leaves/{id}/approve
- PATCH          /api/hrms/leaves/{id}/reject
- GET/POST       /api/hrms/attendance
- PATCH          /api/hrms/attendance/{id}/checkout
- GET/POST       /api/hrms/payslips

## ERP
- GET/POST       /api/erp/products
- GET/POST/PUT/DELETE /api/erp/vendors
- GET/POST       /api/erp/purchase-orders
- PATCH          /api/erp/purchase-orders/{id}/approve

## Projects
- GET/POST       /api/projects
- GET            /api/projects/{id}/tasks
- GET            /api/projects/{id}/milestones
- POST           /api/projects/tasks
- POST           /api/projects/milestones
- GET/POST       /api/projects/timesheets

## Finance
- GET/POST       /api/finance/invoices
- PATCH          /api/finance/invoices/{id}/status
- GET/POST       /api/finance/expenses
- PATCH          /api/finance/expenses/{id}/approve

## CRM
- GET/POST       /api/crm/leads
- PUT/DELETE     /api/crm/leads/{id}
- GET/POST       /api/crm/contacts
- PUT/DELETE     /api/crm/contacts/{id}
- GET/POST       /api/crm/deals
- PATCH          /api/crm/deals/{id}/stage

## Analytics
- GET /api/analytics/hr
- GET /api/analytics/finance
- GET /api/analytics/departments
- GET /api/analytics/activity-trend
- GET /api/analytics/documents

## Documents
- GET/POST    /api/documents
- DELETE      /api/documents/{id}

## AI
- POST /api/ai/chat

## Support
- GET/POST /api/support/tickets
- PATCH    /api/support/tickets/{id}/close

## Notifications
- GET/POST /api/notifications
- PATCH    /api/notifications/{id}/read
