"""Baseline revision placeholder.

When PostgreSQL is running and the schema from database/schema.sql is applied,
run:

    alembic stamp head

to mark this revision as applied without creating tables.
Autogenerate future migrations with:

    alembic revision --autogenerate -m "describe change"
"""

revision = "0001_baseline"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
