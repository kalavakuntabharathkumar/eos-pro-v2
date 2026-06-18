from fastapi.responses import JSONResponse
from typing import Any, Optional

def success_response(data: Any, message: str = "Success", status_code: int = 200):
    return JSONResponse(status_code=status_code, content={"success": True, "message": message, "data": data})

def error_response(message: str, status_code: int = 400, details: Optional[Any] = None):
    content = {"success": False, "message": message}
    if details:
        content["details"] = details
    return JSONResponse(status_code=status_code, content=content)

def paginated_response(data: list, total: int, page: int, limit: int):
    return {
        "success": True, "data": data,
        "pagination": {"total": total, "page": page, "limit": limit, "pages": (total + limit - 1) // limit},
    }
