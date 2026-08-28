# Agroscan

AgroScan is a web-based AI-powered agriculture platform for farmers. A farmer can register, manage crops, upload/capture crop images, detect diseases and pests using AI/ML, receive agricultural advisory, monitor weather, receive notifications, manage crop plans and checklists, browse the marketplace, and consult with an AI farming assistant.

## Repository Structure

```
Agroscan/
├── database/                   # PostgreSQL schema, migrations, seed data & docs
│   ├── README.md               # Detailed database setup, schema docs & backend guides
│   ├── schema.sql              # Full PostgreSQL database DDL (tables, constraints, triggers, indexes)
│   ├── seed.sql                # Safe development mock data
│   └── migrations/
│       └── 001_initial_schema.sql  # Idempotent migration script
├── .gitignore                  # Git ignore rules for environments and temporary files
└── README.md                   # Project overview
```

## Database Quick Start

Refer to the complete [Database Documentation](database/README.md) for architecture, schema details, and backend connection examples.

To initialize the PostgreSQL database:
```bash
# Apply schema
psql -U postgres -d agroscan -f database/schema.sql

# Load development test data
psql -U postgres -d agroscan -f database/seed.sql
```
