# Enterprise OS

A full-stack enterprise operating system with HRMS, CRM, Finance, ERP, Analytics and AI modules.

## Stack
- Backend: Python 3.11 + FastAPI + PostgreSQL + SQLAlchemy
- Frontend: React 18 + Vite + TypeScript + Tailwind CSS

## Modules
- HRMS (Employees, Departments, Leaves, Attendance, Payslips)
- CRM (Leads, Contacts, Deals)
- Finance (Invoices, Expenses)
- ERP (Products, Vendors, Purchase Orders)
- Projects (Tasks, Milestones, Timesheets)
- Analytics (HR, Finance, Departments, Activity)
- Documents (Upload, List, Delete)
- AI Copilot (OpenAI GPT-4o-mini)
- Support (Tickets)
- Notifications

## Getting Started
1. `cp .env.example .env` and fill in your secrets
2. `pip install -r requirements.txt`
3. `python -m backend.seed`
4. `uvicorn backend.main:app --reload`
