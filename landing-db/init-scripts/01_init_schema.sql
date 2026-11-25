-- =========================================================
-- Inicjalizacja bazy danych dla Diet-Med Landing Page
-- =========================================================

-- 1. Tabela zapisów na listę oczekujących (Waiting List)
CREATE TABLE IF NOT EXISTS waitlist_entries (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(120),
    platform VARCHAR(32) NOT NULL DEFAULT 'oba',
    ailments_interest TEXT,
    rodo_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    marketing_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    source VARCHAR(100) DEFAULT 'landing_page',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela zapytań o spotkanie online z dietetykiem (MAKRO)
CREATE TABLE IF NOT EXISTS consultation_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(40),
    height_cm INTEGER,
    weight_kg NUMERIC(5,1),
    activity_level VARCHAR(64),
    ailments_note TEXT,
    message TEXT,
    preferred_contact VARCHAR(64) DEFAULT 'online_video',
    rodo_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(32) NOT NULL DEFAULT 'nowe',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_consultations_created ON consultation_requests(created_at DESC);
