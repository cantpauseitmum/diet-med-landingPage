from sqlalchemy import Boolean, Column, DateTime, Integer, Numeric, String, Text
from sqlalchemy.sql import func
from app.database import Base


class WaitlistEntry(Base):
    """Zapis użytkownika na listę oczekujących aplikacji mobilnej Diet-Med App."""

    __tablename__ = "waitlist_entries"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(120), nullable=True)
    platform = Column(String(32), nullable=False, default="oba")
    ailments_interest = Column(Text, nullable=True)
    rodo_accepted = Column(Boolean, nullable=False, default=True)
    marketing_accepted = Column(Boolean, nullable=False, default=False)
    source = Column(String(100), default="landing_page")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ConsultationRequest(Base):
    """Zgłoszenie na konsultację online z dietetykiem (ustalenie MAKRO)."""

    __tablename__ = "consultation_requests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(40), nullable=True)
    height_cm = Column(Integer, nullable=True)
    weight_kg = Column(Numeric(5, 1), nullable=True)
    activity_level = Column(String(64), nullable=True)
    ailments_note = Column(Text, nullable=True)
    message = Column(Text, nullable=True)
    preferred_contact = Column(String(64), default="online_video")
    rodo_accepted = Column(Boolean, nullable=False, default=True)
    status = Column(String(32), nullable=False, default="nowe")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
