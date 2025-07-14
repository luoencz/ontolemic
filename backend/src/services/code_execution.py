"""Code execution service for running Python code safely."""
import io
import traceback
from contextlib import redirect_stdout, redirect_stderr
from typing import Dict, Any


def execute_python_code(code: str) -> Dict[str, Any]:
    """
    Execute Python code safely and return results.
    
    Args:
        code: Python code to execute
        
    Returns:
        Dictionary with execution results
    """
    # Capture stdout and stderr
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    
    try:
        # Create a restricted execution environment
        exec_globals = {
            "__builtins__": {
                # Safe built-ins only
                "print": print,
                "len": len,
                "range": range,
                "str": str,
                "int": int,
                "float": float,
                "list": list,
                "dict": dict,
                "tuple": tuple,
                "set": set,
                "min": min,
                "max": max,
                "sum": sum,
                "abs": abs,
                "round": round,
                # Add common modules
                "math": __import__("math"),
                "random": __import__("random"),
                "datetime": __import__("datetime"),
                "json": __import__("json"),
            }
        }
        
        # Execute code with output capture
        with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
            exec(code, exec_globals)
        
        output = stdout_capture.getvalue()
        error_output = stderr_capture.getvalue()
        
        return {
            "success": True,
            "output": output,
            "error": error_output if error_output else None
        }
        
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"
        
        return {
            "success": False,
            "output": stdout_capture.getvalue(),
            "error": error_msg
        } 