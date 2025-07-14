from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base


class Session(Base):
    __tablename__ = 'sessions'

    id = Column(Integer, primary_key=True)
    visitor_id = Column(Integer, ForeignKey('visitors.id'))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    last_heartbeat = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    action_count = Column(Integer, default=0)
    duration = Column(Float)  # in seconds

    visitor = relationship('Visitor', back_populates='sessions') 