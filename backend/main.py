"""
FastAPI backend for Inner Cosmos personal website.
Provides endpoints for on-demand Python code execution.
"""

import sys
import io
import traceback
from contextlib import redirect_stdout, redirect_stderr
from typing import Dict, Any
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(title="Inner Cosmos API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "https://home.the-o.space",  # Canonical production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    """Request model for code execution."""
    code: str
    timeout: int = 30


class CodeResponse(BaseModel):
    """Response model for code execution."""
    success: bool
    output: str
    error: str | None = None
    execution_time: float


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Inner Cosmos API is running"}


@app.post("/execute", response_model=CodeResponse)
async def execute_code(request: CodeRequest):
    """
    Execute Python code safely and return results.
    
    Args:
        request: CodeRequest containing code to execute
        
    Returns:
        CodeResponse with execution results
    """
    import time
    
    start_time = time.time()
    
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
            exec(request.code, exec_globals)
        
        execution_time = time.time() - start_time
        output = stdout_capture.getvalue()
        error_output = stderr_capture.getvalue()
        
        return CodeResponse(
            success=True,
            output=output,
            error=error_output if error_output else None,
            execution_time=execution_time
        )
        
    except Exception as e:
        execution_time = time.time() - start_time
        error_msg = f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"
        
        return CodeResponse(
            success=False,
            output=stdout_capture.getvalue(),
            error=error_msg,
            execution_time=execution_time
        )


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time code execution.
    """
    await websocket.accept()
    
    try:
        while True:
            # Receive code from client
            data = await websocket.receive_json()
            code = data.get("code", "")
            
            if not code:
                await websocket.send_json({
                    "success": False,
                    "error": "No code provided"
                })
                continue
            
            # Execute and stream results
            stdout_capture = io.StringIO()
            stderr_capture = io.StringIO()
            
            try:
                exec_globals = {
                    "__builtins__": {
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
                        "math": __import__("math"),
                        "random": __import__("random"),
                        "datetime": __import__("datetime"),
                        "json": __import__("json"),
                    }
                }
                
                with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                    exec(code, exec_globals)
                
                await websocket.send_json({
                    "success": True,
                    "output": stdout_capture.getvalue(),
                    "error": stderr_capture.getvalue() or None
                })
                
            except Exception as e:
                error_msg = f"{type(e).__name__}: {str(e)}"
                await websocket.send_json({
                    "success": False,
                    "output": stdout_capture.getvalue(),
                    "error": error_msg
                })
                
    except WebSocketDisconnect:
        pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 