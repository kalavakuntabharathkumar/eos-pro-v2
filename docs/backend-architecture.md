# Backend Architecture

## Overview
Enterprise OS backend is a FastAPI application using SQLAlchemy ORM with PostgreSQL.

## Directory Structure
```
backend/
├── main.py           # FastAPI app, router registration, CORS
├── config.py         # Environment-based settings via pydantic-settings
├── database.py       # Engine, session, Base, get_db dependency
├── models.py         # 28 SQLAlchemy models covering all domains
├── security.py       # JWT token creation/verification, password hashing
├── rbac.py           # Role-based access control, permission matrix
├── seed.py           # Demo data seeder
├── routers/          # Domain-scoped FastAPI routers
├── services/         # Business logic and analytics aggregation
├── workflows/        # Workflow engine, triggers, and step runner
├── middleware/       # Data scoping, auth middleware
└── utils/            # Response helpers
```

## Auth Flow
1. POST /api/auth/login → JWT access + refresh token pair
2. All protected endpoints require Bearer token in Authorization header
3. get_current_user dependency validates token and returns User model
4. RBAC decorator checks per-action permissions

## Role Hierarchy
- ADMIN: full access to everything
- HR: all HRMS + analytics + documents
- MANAGER: HRMS + projects + analytics (own dept)
- FINANCE: finance + analytics + documents
- CRM: CRM + analytics
- EMPLOYEE: own records only (leaves, attendance, payslips)

## Data Scoping
Row-level security enforced via scope_query_by_role() in middleware/scoping.py.
Employees see only their own records; managers see their department's data.
