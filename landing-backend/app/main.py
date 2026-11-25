import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.routers import consultations, waitlist

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("diet_med_landing")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Tworzy tabele w bazie SQL przy starcie aplikacji, jeśli jeszcze nie istnieją."""
    logger.info("Uruchamianie Diet-Med Landing Page API...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Tabele waitlist_entries i consultation_requests gotowe.")
    except Exception as exc:
        logger.error(f"Błąd inicjalizacji bazy danych przy starcie: {exc}")
    yield
    logger.info("Zamykanie Diet-Med Landing Page API...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Lekki backend SQL do obsługi listy oczekujących (Waiting List) i zapisów na konsultacje online MAKRO z dietetykiem dla Diet-Med Landing Page.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(waitlist.router)
app.include_router(consultations.router)


@app.get("/api/health", tags=["System"])
def health_check():
    """Endpoint kontrolny dla Dockera i monitoringu."""
    return {"status": "ok", "service": "diet-med-landing-backend"}
