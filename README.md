# Diet-Med Landing Page (`diet-med-landingPage`)

Kompletny, samodzielny projekt strony produktowej promującej docelową aplikację mobilną **Diet-Med App** i kierującej użytkowników do działającej wersji Live Demo w [`../diet-med-app`](../diet-med-app) (`app.diet-med-app`).

## Architektura 3 kontenerów (`docker-compose.yml`)

1. **`landing-db`** (`diet-med-landing-DB`, PostgreSQL 16-alpine, domyślny port hosta `5433`):
   - `waitlist_entries` – zapisy na listę oczekujących (Android / iOS) z walidacją zgód RODO,
   - `consultation_requests` – zapisy na konsultację online z dietetykiem (ustalenie MAKRO wraz z opcjonalnymi danymi biologicznymi).
2. **`landing-backend`** (`diet-med-landing-backend`, FastAPI, domyślny port hosta `8001`):
   - `GET /api/waitlist/stats` – aktualna liczba zapisanych osób,
   - `POST /api/waitlist` – rejestracja na listę oczekujących (bezpieczna obsługa duplikatów e-mail),
   - `POST /api/consultations` – rejestracja zgłoszenia na konsultację online MAKRO,
   - `GET /api/health` – healthcheck aplikacji.
3. **`landing-frontend`** (`diet-med-landing-frontend`, Nginx + HTML5/CSS3/Vanilla JS, domyślny port hosta `3001`):
   - Sekcja Hero z bezpośrednim CTA do **Live Demo** (`app.diet-med-app`) oraz **Waiting Listy** + Phone Mockup,
   - Teksty marki DIET-MED (Olga Felicjaniak) ujednolicone do **4 kategorii** (*Zalecane, Dozwolone, Ograniczone, Zakazane*) oraz **6 aktywnych schorzeń** z Demo,
   - Interaktywna prezentacja **4 ekranów aplikacji mobilnej** (Phone Mockups),
   - **Mini-Symulator „Lodówka & Agent AI (4 posiłki)”** wykorzystujący rzeczywiste statusy i reguły konfliktów z bazy DIET-MED + kalkulator biometrii (wzrost, waga, aktywność),
   - Podstrona [`polityka-prywatnosci.html`](./landing-frontend/src/polityka-prywatnosci.html) (RODO), banner cookies oraz gotowe miejsca na **Google Analytics 4 (GA4)** i **Meta Pixel**.

## Konfiguracja przed produkcją

1. **Google Analytics 4 & Meta Pixel:** Wpisz swoje identyfikatory (`GA4_ID`, `META_PIXEL_ID`) w `landing-frontend/src/index.html` (sekcja `<head>` oraz `window.DIET_MED_CONFIG`) oraz w `polityka-prywatnosci.html`.
2. **Zdjęcie Olgi Felicjaniak:** Wgraj zdjęcie do `landing-frontend/src/assets/olga.jpg` (do tego czasu automatycznie wyświetla się estetyczny monogram `OF`).
3. **Domeny (`landing.diet-med-app` & `app.diet-med-app`):** Wszystkie linki Demo automatycznie zamieniają prefiks `landing.` na `app.` w bieżącej domenie (z domyślnym fallbackiem `https://app.diet-med-app.pl` z `DIET_MED_CONFIG.DEMO_URL`).
4. **Uruchomienie lokalne (Docker Compose):**
   ```bash
   cp .env.example .env
   docker compose up -d --build
   ```
   Aplikacja będzie dostępna pod `http://localhost:3001` (bez kolizji z portem `3000` projektu `diet-med-app`).

5. **Wdrożenie w Portainerze (bezpośrednio z GitHuba):**
   - **Opcja A (Zalecana — Stacks &rarr; Add stack &rarr; Repository):**
     - Repository URL: `https://github.com/cantpauseitmum/diet-med-landingPage`
     - Reference: `refs/heads/main`
     - Compose path: `docker-compose.yml`
   - **Opcja B (Web Editor z podkatalogami Git):**
     W sekcjach `build:` możesz użyć bezpośrednich ścieżek GitHuba:
     - `https://github.com/cantpauseitmum/diet-med-landingPage.git#main:landing-db`
     - `https://github.com/cantpauseitmum/diet-med-landingPage.git#main:landing-backend`
     - `https://github.com/cantpauseitmum/diet-med-landingPage.git#main:landing-frontend`
   - **Cloudflare Tunnel:** Skieruj subdomenę `landing.diet-med-app.*` na port `3001` (lub bezpośrednio na kontener `diet-med-landing-frontend:80` w sieci Dockera).
