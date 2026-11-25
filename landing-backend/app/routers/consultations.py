import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ConsultationRequest
from app.schemas import ConsultationCreate, ConsultationResponse

logger = logging.getLogger("diet_med_landing")

router = APIRouter(prefix="/api/consultations", tags=["Konsultacje Online MAKRO"])


@router.post("", response_model=ConsultationResponse)
def request_consultation(payload: ConsultationCreate, db: Session = Depends(get_db)):
    """
    Rejestruje prośbę o umówienie konsultacji online z dietetykiem klinicznym
    w celu indywidualnego ustalenia zapotrzebowania MAKRO i kaloryczności.
    """
    try:
        record = ConsultationRequest(
            name=payload.name.strip(),
            email=payload.email.strip().lower(),
            phone=payload.phone.strip() if payload.phone else None,
            height_cm=payload.height_cm,
            weight_kg=payload.weight_kg,
            activity_level=payload.activity_level.strip() if payload.activity_level else None,
            ailments_note=payload.ailments_note.strip() if payload.ailments_note else None,
            message=payload.message.strip() if payload.message else None,
            preferred_contact=payload.preferred_contact,
            rodo_accepted=payload.rodo_accepted,
            status="nowe",
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        logger.info(f"Zarejestrowano prośbę o konsultację online: id={record.id}")
        return ConsultationResponse(
            id=record.id,
            status=record.status,
            message="Dziękujemy! Twoje zgłoszenie na konsultację online w celu ustalenia MAKRO zostało zapisane. Skontaktujemy się wkrótce, aby potwierdzić dogodny termin.",
            created_at=record.created_at,
        )
    except Exception as exc:
        db.rollback()
        logger.error(f"Błąd zapisu zgłoszenia na konsultację: {exc}")
        raise HTTPException(status_code=500, detail="Nie udało się zapisać zgłoszenia na konsultację. Spróbuj ponownie.")
