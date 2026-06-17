from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float, Text, Enum, Index
from sqlalchemy.orm import relationship
from backend.database import Base
import enum

class Role(str, enum.Enum):
    ADMIN = "admin"
    HR = "hr"
    MANAGER = "manager"
    EMPLOYEE = "employee"
    FINANCE = "finance"
    CRM = "crm"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(Role), default=Role.EMPLOYEE)
    is_active = Column(Boolean, default=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    created_at = Column(DateTime)
    department = relationship("Department", back_populates="employees", foreign_keys=[department_id])

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True)
    head_of_department_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime)
    employees = relationship("User", back_populates="department", foreign_keys=[User.department_id])

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), index=True)
    leave_type = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    reason = Column(Text)
    status = Column(String, default="pending")
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime)

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), index=True)
    date = Column(DateTime)
    check_in = Column(DateTime)
    check_out = Column(DateTime, nullable=True)
    status = Column(String, default="present")

class Payslip(Base):
    __tablename__ = "payslips"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), index=True)
    month = Column(Integer)
    year = Column(Integer)
    basic_salary = Column(Float)
    allowances = Column(Float, default=0)
    deductions = Column(Float, default=0)
    net_salary = Column(Float)
    generated_at = Column(DateTime)

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True)
    client_name = Column(String)
    amount = Column(Float)
    tax = Column(Float, default=0)
    status = Column(String, default="draft")
    due_date = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime)

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    amount = Column(Float)
    category = Column(String)
    submitted_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending")
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime)

class CRMLead(Base):
    __tablename__ = "crm_leads"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    company = Column(String)
    phone = Column(String, nullable=True)
    status = Column(String, default="new")
    value = Column(Float, default=0)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    created_at = Column(DateTime)

class CRMContact(Base):
    __tablename__ = "crm_contacts"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String)
    company = Column(String)
    phone = Column(String, nullable=True)
    position = Column(String, nullable=True)
    created_at = Column(DateTime)

class CRMDeal(Base):
    __tablename__ = "crm_deals"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    value = Column(Float)
    stage = Column(String, default="prospecting")
    contact_id = Column(Integer, ForeignKey("crm_contacts.id"), index=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    close_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime)

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    contact_email = Column(String)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    category = Column(String)
    created_at = Column(DateTime)

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String, unique=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    total_amount = Column(Float)
    status = Column(String, default="pending")
    items = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    sku = Column(String, unique=True)
    category = Column(String)
    quantity = Column(Integer, default=0)
    unit_price = Column(Float)
    reorder_level = Column(Integer, default=10)
    created_at = Column(DateTime)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text, nullable=True)
    status = Column(String, default="active")
    start_date = Column(DateTime)
    end_date = Column(DateTime, nullable=True)
    manager_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), index=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="todo")
    priority = Column(String, default="medium")
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime)

class Milestone(Base):
    __tablename__ = "milestones"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"))
    due_date = Column(DateTime)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime)

class Timesheet(Base):
    __tablename__ = "timesheets"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    hours = Column(Float)
    date = Column(DateTime)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    notification_type = Column(String)
    created_at = Column(DateTime)

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    action = Column(String)
    resource = Column(String)
    resource_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime)

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    created_at = Column(DateTime)

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    priority = Column(String, default="medium")
    status = Column(String, default="open")
    submitted_by = Column(Integer, ForeignKey("users.id"))
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class Workflow(Base):
    __tablename__ = "workflows"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text, nullable=True)
    trigger = Column(String)
    steps = Column(Text)
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime)
