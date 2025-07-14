"""Code execution endpoints."""
import time
from fastapi import APIRouter
from ..schemas import CodeRequest, CodeResponse
from ..services import execute_python_code

router = APIRouter()


@router.post("/execute", response_model=CodeResponse)
async def execute_code(request: CodeRequest):
    """
    Execute Python code safely and return results.
    
    Args:
        request: CodeRequest containing code to execute
        
    Returns:
        CodeResponse with execution results
    """
    start_time = time.time()
    
    # Execute the code
    result = execute_python_code(request.code)
    
    execution_time = time.time() - start_time
    
    return CodeResponse(
        success=result["success"],
        output=result["output"],
        error=result["error"],
        execution_time=execution_time
    ) 