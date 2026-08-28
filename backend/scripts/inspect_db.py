"""Inspect the live PostgreSQL schema and compare to the SQLAlchemy models.

Usage (from backend/):
    python scripts/inspect_db.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import OperationalError

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from app.core.config import get_settings  # noqa: E402
from app.core.database import Base  # noqa: E402
import app.models  # noqa: F401, E402

EXPECTED_FROM_SQL = [
    "users",
    "farms",
    "fields",
    "crops",
    "crop_registrations",
    "crop_plans",
    "crop_tasks",
    "diseases_pests",
    "crop_images",
    "ai_detection_results",
    "advisories",
    "weather_records",
    "notifications",
    "ai_conversations",
    "ai_messages",
    "marketplace_stores",
    "marketplace_products",
    "support_tickets",
    "support_ticket_messages",
    "app_translations",
]

PROMPT_SCHEMA_MAP = {
    "users": "users",
    "crops (farmer instance)": "crop_registrations (+ crops catalog, farms, fields)",
    "crop_plans": "crop_plans + crop_tasks",
    "detections": "crop_images + ai_detection_results + advisories",
    "notifications": "notifications",
    "weather_snapshots": "weather_records",
    "market_listings": "marketplace_products + marketplace_stores",
    "help_desk_tickets": "support_tickets + support_ticket_messages",
}


def main() -> int:
    settings = get_settings()
    model_tables = sorted(Base.metadata.tables.keys())

    print("=" * 60)
    print("AgroScan Database Inspection")
    print("=" * 60)
    print(f"\nConnection: {settings.database_url.split('@')[-1]}")
    print(f"\nSQLAlchemy models ({len(model_tables)} tables):")
    for name in model_tables:
        print(f"  - {name}")

    print("\nExpected from database/schema.sql (20 tables):")
    for name in EXPECTED_FROM_SQL:
        print(f"  - {name}")

    print("\nPrompt schema -> existing DB mapping:")
    for prompt, existing in PROMPT_SCHEMA_MAP.items():
        print(f"  {prompt:28} -> {existing}")

    try:
        engine = create_engine(settings.sqlalchemy_database_url, pool_pre_ping=True)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            inspector = inspect(engine)
            live_tables = sorted(inspector.get_table_names())

            print(f"\n[OK] Connected. Live tables ({len(live_tables)}):")
            for table in live_tables:
                columns = inspector.get_columns(table)
                col_names = ", ".join(c["name"] for c in columns)
                print(f"  - {table} ({len(columns)} cols): {col_names}")

            missing_in_db = sorted(set(model_tables) - set(live_tables))
            extra_in_db = sorted(set(live_tables) - set(model_tables) - {"alembic_version"})

            if missing_in_db:
                print("\n[WARN] Tables in models but NOT in live DB:")
                for t in missing_in_db:
                    print(f"  - {t}")

            if extra_in_db:
                print("\n[WARN] Tables in live DB but NOT in models (review before dropping):")
                for t in extra_in_db:
                    print(f"  - {t}")

            if not missing_in_db and not extra_in_db:
                print("\n[OK] Live DB tables match SQLAlchemy models.")

            try:
                version = conn.execute(text("SELECT version_num FROM alembic_version")).scalar()
                print(f"\nAlembic version: {version}")
            except Exception:
                print("\nAlembic version: (alembic_version table not found — run `alembic stamp head` after setup)")

    except OperationalError as exc:
        print(f"\n[FAIL] Could not connect to PostgreSQL: {exc.orig}")
        print("\nStart the database first:")
        print("  docker compose up -d postgres   (from repo root)")
        print("  node scripts/setup-db.mjs       (apply schema + seed)")
        return 1

    print("\nNext steps:")
    print("  1. If DB matches models: alembic stamp head")
    print("  2. If columns differ: alembic revision --autogenerate -m 'describe change'")
    print("  3. Review migration SQL before running alembic upgrade head")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
