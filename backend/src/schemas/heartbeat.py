"""Heartbeat related schemas."""
from pydantic import BaseModel


class HeartbeatRequest(BaseModel):
    event_type: str  # e.g., 'page_load', 'scroll', 'click' 