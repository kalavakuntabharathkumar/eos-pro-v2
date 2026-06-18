from backend.workflows.engine import WorkflowEngine, TriggerType
from typing import Any, Dict
import logging

logger = logging.getLogger(__name__)
engine = WorkflowEngine.get_instance()

def on_leave_approved(leave_id: int, employee_id: int, extra: Dict[str, Any] = None):
    context = {"leave_id": leave_id, "employee_id": employee_id, **(extra or {})}
    logger.info(f"Firing trigger LEAVE_APPROVED for leave={leave_id} employee={employee_id}")
    return engine.fire_trigger(TriggerType.LEAVE_APPROVED, context)

def on_employee_created(employee_id: int, extra: Dict[str, Any] = None):
    logger.info(f"Firing trigger EMPLOYEE_CREATED for employee={employee_id}")
    return engine.fire_trigger(TriggerType.EMPLOYEE_CREATED, {"employee_id": employee_id, **(extra or {})})

def on_invoice_paid(invoice_id: int, amount: float, extra: Dict[str, Any] = None):
    return engine.fire_trigger(TriggerType.INVOICE_PAID, {"invoice_id": invoice_id, "amount": amount, **(extra or {})})

def on_expense_approved(expense_id: int, extra: Dict[str, Any] = None):
    return engine.fire_trigger(TriggerType.EXPENSE_APPROVED, {"expense_id": expense_id, **(extra or {})})

def on_ticket_created(ticket_id: int, priority: str, extra: Dict[str, Any] = None):
    return engine.fire_trigger(TriggerType.TICKET_CREATED, {"ticket_id": ticket_id, "priority": priority, **(extra or {})})

def hook_leave_approval(db, leave, approver_id: int):
    """Called from leaves router after approval is persisted to DB."""
    try:
        on_leave_approved(leave.id, leave.employee_id, {"approver_id": approver_id})
    except Exception as e:
        logger.warning(f"Workflow trigger failed silently: {e}")
