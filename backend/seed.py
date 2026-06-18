from backend.database import SessionLocal, create_tables
from backend.models import User, Department
from backend.security import hash_password
from datetime import datetime

def seed():
    create_tables()
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Database already seeded. Skipping.")
            return

        eng = Department(name="Engineering", code="ENG", created_at=datetime.utcnow())
        hr_dept = Department(name="Human Resources", code="HR", created_at=datetime.utcnow())
        fin = Department(name="Finance", code="FIN", created_at=datetime.utcnow())
        sales = Department(name="Sales & CRM", code="CRM", created_at=datetime.utcnow())
        db.add_all([eng, hr_dept, fin, sales])
        db.commit()

        users = [
            User(email="admin@enterprise-os.dev", hashed_password=hash_password("Admin@123"),
                full_name="System Admin", role="admin", is_active=True, created_at=datetime.utcnow()),
            User(email="hr@enterprise-os.dev", hashed_password=hash_password("Hr@123456"),
                full_name="Priya Sharma", role="hr", department_id=hr_dept.id, is_active=True, created_at=datetime.utcnow()),
            User(email="finance@enterprise-os.dev", hashed_password=hash_password("Fin@123456"),
                full_name="Arjun Mehta", role="finance", department_id=fin.id, is_active=True, created_at=datetime.utcnow()),
            User(email="employee@enterprise-os.dev", hashed_password=hash_password("Emp@123456"),
                full_name="Ravi Kumar", role="employee", department_id=eng.id, is_active=True, created_at=datetime.utcnow()),
            User(email="manager@enterprise-os.dev", hashed_password=hash_password("Mgr@123456"),
                full_name="Kavitha Rao", role="manager", department_id=eng.id, is_active=True, created_at=datetime.utcnow()),
        ]
        db.add_all(users)
        db.commit()

        print("✓ Seed complete")
        print("  admin@enterprise-os.dev    / Admin@123")
        print("  hr@enterprise-os.dev       / Hr@123456")
        print("  finance@enterprise-os.dev  / Fin@123456")
        print("  employee@enterprise-os.dev / Emp@123456")
        print("  manager@enterprise-os.dev  / Mgr@123456")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
