# AgroScan Database Documentation

Welcome to the **AgroScan** Database module. This directory houses the complete PostgreSQL schema, migration scripts, testing seed data, and connection guides for the AgroScan AI-powered agriculture platform.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Entity-Relationship Diagram](#entity-relationship-diagram)
3. [Tables & Domains Reference](#tables--domains-reference)
4. [Core Relational Workflows](#core-relational-workflows)
5. [Prerequisites & Requirements](#prerequisites--requirements)
6. [Local Database Setup](#local-database-setup)
7. [Running Schema and Seed Data](#running-schema-and-seed-data)
8. [Backend Integration Guide](#backend-integration-guide)
9. [Cloud Deployment Guide](#cloud-deployment-guide)
10. [Security & Production Best Practices](#security--production-best-practices)

---

## 1. Architecture Overview

- **Database Engine**: PostgreSQL 13+ (tested with 14, 15, 16).
- **Normalization**: Strict 3rd Normal Form (3NF) relational model.
- **Primary Keys**: Universal Unique Identifiers (UUID v4) generated via `gen_random_uuid()` from `pgcrypto`.
- **Timestamps**: All timestamps use `TIMESTAMPTZ` (UTC with timezone support) with automatic `updated_at` trigger handlers.
- **Media Asset Policy**: High-resolution images and multimedia are **never stored as binary bytea/BLOBs** inside the database; only remote CDN/S3 HTTPS URIs and metadata are tracked.
- **Multilingual Support**: Fully normalized key-value translation table (`app_translations`) eliminates hardcoded multilingual column sprawl.

---

## 2. Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ FARMS : owns
    USERS ||--o{ CROP_IMAGES : uploads
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ AI_CONVERSATIONS : creates
    USERS ||--o{ MARKETPLACE_STORES : operates
    USERS ||--o{ SUPPORT_TICKETS : opens
    
    FARMS ||--o{ FIELDS : contains
    FARMS ||--o{ WEATHER_RECORDS : logs
    
    FIELDS ||--o{ CROP_REGISTRATIONS : hosts
    
    CROPS ||--o{ CROP_REGISTRATIONS : classifies
    CROPS ||--o{ DISEASES_PESTS : targets
    
    CROP_REGISTRATIONS ||--o{ CROP_PLANS : tracks
    CROP_REGISTRATIONS ||--o{ CROP_IMAGES : associates
    
    CROP_PLANS ||--o{ CROP_TASKS : contains
    
    CROP_IMAGES ||--o{ AI_DETECTION_RESULTS : yields
    
    DISEASES_PESTS ||--o{ AI_DETECTION_RESULTS : identifies
    DISEASES_PESTS ||--o{ ADVISORIES : provides
    
    AI_CONVERSATIONS ||--o{ AI_MESSAGES : contains
    
    MARKETPLACE_STORES ||--o{ MARKETPLACE_PRODUCTS : stocks
    
    SUPPORT_TICKETS ||--o{ SUPPORT_TICKET_MESSAGES : contains
```

---

## 3. Tables & Domains Reference

The schema contains **20 normalized tables**:

| Table | Domain / Feature | Description |
|---|---|---|
| `users` | User & Auth | Farmer, agronomist, store owner, and admin user profiles. |
| `farms` | Farm Holdings | Physical agricultural properties and geographic locations. |
| `fields` | Farm Parcels | Specific land plots with soil type and irrigation source details. |
| `crops` | Crop Catalog | Master catalog of agricultural crops (botanical name, season, temp ranges). |
| `crop_registrations` | "My Crops" | Specific planting batches per field, sowing dates, and lifecycle stage. |
| `crop_plans` | Crop Management | Master schedule and overall completion progress for a crop. |
| `crop_tasks` | Task Checklist | Actionable tasks (ploughing, seeding, irrigation, fertigation, harvest). |
| `diseases_pests` | Plant Pathology | Master catalog of crop diseases, pests, deficiencies, and symptoms. |
| `crop_images` | Image Storage | Metadata, geo-coordinates, and cloud URLs of farmer crop photos. |
| `ai_detection_results` | AI/ML Inference | Computer vision model outputs, confidence scores, and bounding boxes. |
| `advisories` | Advisory Engine | Organic treatments, chemical remedies, preventive actions, dosages. |
| `weather_records` | Weather Analytics | Time-series meteorological observations and forecasts for farms. |
| `notifications` | Alert System | Priority-based alerts (weather warnings, task reminders, pest alerts). |
| `ai_conversations` | AI Voice / Bot | Consultation threads between farmers and the AI assistant. |
| `ai_messages` | AI Dialogue | Individual conversation turns with metadata and token usage. |
| `marketplace_stores` | Market Store | Storefront profiles, FPOs, and agricultural retail outlets. |
| `marketplace_products` | Agri-Commerce | Seeds, fertilizers, bio-pesticides, tools, and pricing catalog. |
| `support_tickets` | Help Desk | Farmer support tickets, inquiry categories, and resolution logs. |
| `support_ticket_messages` | Help Desk Chat | Threaded discussions between farmers and agricultural experts. |
| `app_translations` | Localization | Dynamic key-value translation strings for English, Telugu, Hindi, etc. |

---

## 4. Core Relational Workflows

### 4.1 Farmer → Farm → Field → Crop Registration
1. A farmer registers an account in `users`.
2. The farmer creates a farm holding in `farms` (specifying state, district, village, GPS coordinates).
3. The farmer subdivides the farm into plots in `fields` (specifying acreage, soil type, irrigation).
4. The farmer registers a crop cycle in `crop_registrations` linking a `field_id` to a master `crop_id`.
5. An automated or custom `crop_plans` record is initialized with sequential `crop_tasks`.

### 4.2 Crop Image → AI Detection → Disease → Advisory
1. The farmer takes a photo of an unhealthy leaf; the backend uploads the file to S3/Cloud Storage and logs metadata in `crop_images`.
2. The AI vision microservice runs inference and creates an `ai_detection_results` record with confidence and bounding box data.
3. The detected issue maps to `diseases_pests`.
4. The system queries `advisories` matching the condition and severity level to provide instant **organic treatments**, **chemical remedies**, and **preventive guidelines**.

---

## 5. Prerequisites & Requirements

- **PostgreSQL**: Version 13 or higher.
- **Extensions**: `pgcrypto` (built-in standard extension).
- **Client Tools**: `psql`, pgAdmin, DBeaver, or any modern database client.

---

## 6. Local Database Setup

### Option A: Using Local PostgreSQL

1. Open your terminal or `psql` shell as the `postgres` superuser:
   ```bash
   psql -U postgres
   ```
2. Create the `agroscan` database:
   ```sql
   CREATE DATABASE agroscan;
   ```
3. Exit `psql`:
   ```bash
   \q
   ```

### Option B: Using Docker

To spin up a PostgreSQL instance instantly with Docker:
```bash
docker run --name agroscan-postgres \
  -e POSTGRES_DB=agroscan \
  -e POSTGRES_USER=agroscan_user \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -d postgres:16-alpine
```

---

## 7. Running Schema and Seed Data

### 7.1 Execute Full Schema
To initialize the database tables, triggers, constraints, and indexes:
```bash
# Using standard psql
psql -U postgres -d agroscan -f database/schema.sql

# If using custom user/host
psql -h localhost -p 5432 -U agroscan_user -d agroscan -f database/schema.sql
```

### 7.2 Execute Migrations (Recommended for CI/CD)
```bash
psql -U postgres -d agroscan -f database/migrations/001_initial_schema.sql
```

### 7.3 Load Sample Development Data (Seed)
To populate realistic mock crops, diseases, advisory treatments, sample farms, and products:
```bash
psql -U postgres -d agroscan -f database/seed.sql
```

---

## 8. Backend Integration Guide

### 8.1 Required Environment Variables

Create a `.env` file in your backend application root (ensure it is gitignored):

```env
# Full connection string format:
DATABASE_URL=postgresql://agroscan_user:secure_password@localhost:5432/agroscan?schema=public&sslmode=prefer

# Or discrete parameters:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agroscan
DB_USER=agroscan_user
DB_PASSWORD=secure_password
DB_SSL=false
```

### 8.2 Node.js / TypeScript Example (Prisma & pg)

#### Using `pg` (node-postgres):
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Example: Fetch active crops for a farmer
export async function getFarmerCrops(farmerId: string) {
  const query = `
    SELECT 
      cr.id, 
      c.name AS crop_name, 
      cr.variety_name, 
      cr.farming_stage, 
      cr.land_area_acres, 
      f.farm_name, 
      fld.field_name
    FROM crop_registrations cr
    JOIN crops c ON cr.crop_id = c.id
    JOIN fields fld ON cr.field_id = fld.id
    JOIN farms f ON fld.farm_id = f.id
    WHERE f.farmer_id = $1 AND cr.status = 'active'
    ORDER BY cr.sowing_date DESC;
  `;
  const result = await pool.query(query, [farmerId]);
  return result.rows;
}
```

### 8.3 Python / FastAPI Example (SQLAlchemy & Asyncpg)

```python
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://agroscan_user:secure_password@localhost:5432/agroscan")

engine = create_async_engine(DATABASE_URL, echo=False, pool_size=10, max_overflow=20)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Example: Get disease advisory by detection result
async def get_advisory_for_detection(detection_id: str):
    async with AsyncSessionLocal() as session:
        query = text("""
            SELECT 
                d.name AS disease_name,
                d.symptoms,
                a.severity_level,
                a.organic_treatment,
                a.chemical_treatment,
                a.preventive_measures,
                a.dosage_instructions
            FROM ai_detection_results r
            JOIN diseases_pests d ON r.disease_pest_id = d.id
            JOIN advisories a ON a.disease_pest_id = d.id
            WHERE r.id = :det_id AND (a.severity_level = r.severity_assessed OR a.severity_level = 'all');
        """)
        result = await session.execute(query, {"det_id": detection_id})
        return result.mappings().all()
```

---

## 9. Cloud Deployment Guide

The schema is 100% compliant with standard managed PostgreSQL providers:

| Provider | Steps to Deploy |
|---|---|
| **Supabase** | 1. Create a project in [Supabase](https://supabase.com).<br>2. Open the SQL Editor in Supabase Dashboard.<br>3. Copy-paste `database/schema.sql` and run.<br>4. (Optional) Run `database/seed.sql` for test data. |
| **Neon** | 1. Create a database project in [Neon](https://neon.tech).<br>2. Connect via `psql` using the Neon connection string and run `\i database/schema.sql`. |
| **AWS RDS / Aurora** | 1. Provision a PostgreSQL 14+ instance in AWS RDS.<br>2. Configure Security Group inbound rules on port 5432.<br>3. Run `psql -h <rds-endpoint> -U <master-user> -d agroscan -f database/schema.sql`. |
| **Render / Railway** | 1. Add a PostgreSQL resource in your service dashboard.<br>2. Use the provided Internal/External `DATABASE_URL` to run the migration script. |

---

## 10. Security & Production Best Practices

1. **No Plaintext Secrets in Code**: Never commit database credentials, `.env` files, or production connection URIs to GitHub.
2. **Encrypted Passwords**: Always hash user passwords on the backend before storing in `users.password_hash` (e.g., using `bcrypt` with cost factor $\ge 12$ or `argon2id`).
3. **Connection Pooling**: Use connection poolers (such as PgBouncer or serverless connection pooling like Prisma Accelerate / Supabase Pooler) to manage concurrent API connections efficiently.
4. **SSL Enforcement**: In staging and production environments, always set `sslmode=require` or `sslmode=verify-full`.
5. **Least Privilege Principle**: Create dedicated application users (`agroscan_app`) with restricted `SELECT`, `INSERT`, `UPDATE`, `DELETE` privileges rather than connecting directly as `postgres` superuser.
