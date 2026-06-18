from typing import Any, Dict
from backend.workflows.engine import WorkflowDefinition
import logging

logger = logging.getLogger(__name__)
ACTION_HANDLERS = {}

def register_action(name: str):
    def decorator(func):
        ACTION_HANDLERS[name] = func
        return func
    return decorator

@register_action("send_notification")
def send_notification(params: Dict, context: Dict) -> Dict:
    user_id = params.get("user_id") or context.get("employee_id")
    message = params.get("message", "").format(**context)
    logger.info(f"Notification -> user={user_id}: {message}")
    return {"sent": True, "user_id": user_id}

@register_action("update_status")
def update_status(params: Dict, context: Dict) -> Dict:
    resource = params.get("resource")
    resource_id = context.get(f"{resource}_id")
    new_status = params.get("status")
    logger.info(f"Status update -> {resource}#{resource_id} = {new_status}")
    return {"updated": True, "resource": resource, "status": new_status}

@register_action("log_activity")
def log_activity_action(params: Dict, context: Dict) -> Dict:
    logger.info(f"Activity log -> action={params.get('action')} context={context}")
    return {"logged": True}

def evaluate_condition(condition: str, context: Dict) -> bool:
    if not condition:
        return True
    try:
        return bool(eval(condition, {}, context))
    except Exception:
        return True

def run_workflow(workflow: WorkflowDefinition, context: Dict[str, Any]) -> Dict:
    results = []
    for step in workflow.steps:
        try:
            if not evaluate_condition(step.condition, context):
                results.append({"step": step.step_id, "skipped": True})
                continue
            handler = ACTION_HANDLERS.get(step.action)
            if not handler:
                results.append({"step": step.step_id, "error": f"Unknown action: {step.action}"})
                continue
            results.append({"step": step.step_id, "result": handler(step.params, context)})
        except Exception as e:
            logger.error(f"Step {step.step_id} failed: {e}")
            results.append({"step": step.step_id, "error": str(e)})
    return {"workflow": workflow.name, "steps": results}
