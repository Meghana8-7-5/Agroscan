# AgroScan FastAPI Backend

## Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Ensure PostgreSQL is running (see repo root `docker compose up -d postgres`).

## Inspect existing database (run before any migration)

```powershell
python scripts/inspect_db.py
```

## Run dev server

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open http://localhost:8000/docs

## Alembic

```powershell
# After DB schema matches models (from database/schema.sql):
alembic stamp head

# For future schema changes:
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```
