import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import WaitlistEntry
from app.schemas import WaitlistCreate, WaitlistResponse, WaitlistStatsResponse

logger = logging.getLogger("diet_med_landing")

router = APIRouter(prefix="/api/waitlist", tags=["Lista oczekujących (Waitlist)"])


@router.get("/stats", response_model=WaitlistStatsResponse)
def get_waitlist_stats(db: Session = Depends(get_db)):
    """Zwraca łączną liczbę osób zapisanych na listę oczekujących."""
    count = db.query(WaitlistEntry).count()
    return WaitlistStatsResponse(total_count=count)


@router.post("", response_model=WaitlistResponse)
def join_waitlist(payload: WaitlistCreate, db: Session = Depends(get_db)):
    """
    Zapisuje użytkownika na listę oczekujących aplikacji mobilnej Diet-Med App.
    Jeśli adres e-mail znajduje się już w bazie, aktualizuje wybrane preferencje i zwraca informację.
    """
    normalized_email = payload.email.strip().lower()
    existing = db.query(WaitlistEntry).filter(WaitlistEntry.email == normalized_email).first()

    if existing:
        existing.platform = payload.platform
        if payload.name:
            existing.name = payload.name.strip()
        if payload.ailments_interest:
            existing.ailments_interest = payload.ailments_interest.strip()
        existing.marketing_accepted = payload.marketing_accepted
        db.commit()
        db.refresh(existing)
        total = db.query(WaitlistEntry).count()
        logger.info(f"Zaktualizowano wpis na liście oczekujących: id={existing.id}")
        return WaitlistResponse(
            id=existing.id,
            email=existing.email,
            platform=existing.platform,
            already_registered=True,
            total_count=total,
            message="Ten adres e-mail jest już na naszej liście oczekujących! Zaktualizowaliśmy Twoje preferencje i damy znać jako pierwszym o premierze.",
        )

    try:
        entry = WaitlistEntry(
            email=normalized_email,
            name=payload.name.strip() if payload.name else None,
            platform=payload.platform,
            ailments_interest=payload.ailments_interest.strip() if payload.ailments_interest else None,
            rodo_accepted=payload.rodo_accepted,
            marketing_accepted=payload.marketing_accepted,
            source=payload.source,
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        total = db.query(WaitlistEntry).count()
        logger.info(f"Nowy zapis na listę oczekujących: id={entry.id}, platform={entry.platform}")
        return WaitlistResponse(
            id=entry.id,
            email=entry.email,
            platform=entry.platform,
            already_registered=False,
            total_count=total,
            message="Dziękujemy! Twój adres został dodany do listy oczekujących. Poinformujemy Cię w pierwszej kolejności o starcie aplikacji mobilnej Diet-Med App.",
        )
    except Exception as exc:
        db.rollback()
        logger.error(f"Błąd zapisu na listę oczekujących: {exc}")
        raise HTTPException(status_code=500, detail="Nie udało się zapisać zgłoszenia. Spróbuj ponownie za chwilę.")
