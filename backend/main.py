from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import create_tables
from backend.routers import auth, employees, departments, leaves, attendance, payslips
from backend.routers import products, vendors, purchase_orders, projects, timesheets

app = FastAPI(
    title="Enterprise OS API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

for router in [auth.router, employees.router, departments.router,
               leaves.router, attendance.router, payslips.router,
               products.router, vendors.router, purchase_orders.router,
               projects.router, timesheets.router]:
    app.include_router(router)

@app.on_event("startup")
async def startup():
    create_tables()

@app.get("/api/health", tags=["health"])
async def health():
    from datetime import datetime
    return {"status": "ok", "version": "1.0.0", "timestamp": datetime.utcnow().isoformat()}
