FROM postgres:16-alpine

LABEL maintainer="Diet-Med Team"
LABEL description="PostgreSQL database for Diet-Med Landing Page (Waitlist & Consultations)"

# Skrypty inicjalizacyjne ładowane przy pierwszym starcie pustego wolumenu
COPY init-scripts/ /docker-entrypoint-initdb.d/

EXPOSE 5432
