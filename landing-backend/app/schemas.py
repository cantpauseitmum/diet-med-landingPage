from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


class WaitlistCreate(BaseModel):
    """Dane wejściowe zapisu na listę oczekujących (Waiting List)."""

    email: EmailStr
    name: Optional[str] = Field(default=None, max_length=120)
    platform: Literal["android", "ios", "oba"] = "oba"
    ailments_interest: Optional[str] = Field(default=None, max_length=500)
    rodo_accepted: bool
    marketing_accepted: bool = False
    source: str = Field(default="landing_page", max_length=100)

    @field_validator("rodo_accepted")
    @classmethod
    def check_rodo(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Wymagana jest akceptacja Polityki Prywatności (RODO).")
        return v


class WaitlistResponse(BaseModel):
    """Odpowiedź po zapisie na listę oczekujących."""

    id: int
    email: str
    platform: str
    already_registered: bool = False
    total_count: int
    message: str


class WaitlistStatsResponse(BaseModel):
    """Statystyki listy oczekujących wyświetlane na Landing Page'u."""

    total_count: int


class ConsultationCreate(BaseModel):
    """Dane zgłoszenia na konsultację online z dietetykiem (MAKRO)."""

    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    height_cm: Optional[int] = Field(default=None, ge=80, le=250)
    weight_kg: Optional[float] = Field(default=None, ge=25.0, le=350.0)
    activity_level: Optional[str] = Field(default=None, max_length=64)
    ailments_note: Optional[str] = Field(default=None, max_length=500)
    message: Optional[str] = Field(default=None, max_length=2000)
    preferred_contact: Literal["online_video", "telefon", "email"] = "online_video"
    rodo_accepted: bool

    @field_validator("rodo_accepted")
    @classmethod
    def check_rodo(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Wymagana jest akceptacja Polityki Prywatności (RODO).")
        return v


class ConsultationResponse(BaseModel):
    """Potwierdzenie rejestracji zgłoszenia na konsultację."""

    id: int
    status: str
    message: str
    created_at: Optional[datetime] = None
