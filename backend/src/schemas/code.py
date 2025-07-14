"""Code execution related schemas."""
from pydantic import BaseModel


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