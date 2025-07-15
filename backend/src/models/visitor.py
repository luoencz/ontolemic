from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base


class Visitor(Base):
    __tablename__ = 'visitors'

    id = Column(Integer, primary_key=True)
    cookie_id = Column(String, unique=True, index=True)
    ip_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_seen_at = Column(DateTime, default=datetime.utcnow)
    country_code = Column(String)
    region = Column(String)
    city = Column(String)

    sessions = relationship('Session', back_populates='visitor') 