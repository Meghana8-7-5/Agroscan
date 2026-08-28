# AgroScan

AgroScan is a web-based, AI-assisted agriculture platform for farmers. The approved frontend is designed as a warm **Field Notes** crop-care companion: it turns a farmer’s next field action into a clear, calm step such as registering a crop, reviewing a plan, scanning a leaf, reading the weather, or acting on a notification. The repository also contains the existing PostgreSQL schema, migrations, seed data, and database documentation.

## Repository structure

```text
Agroscan/
├── client/                     # React + Vite frontend
│   ├── src/pages/              # Route-level AgroScan pages
│   ├── src/mock/               # Mock detection API used by the frontend
│   └── src/index.css           # Field Notes design tokens and page styles
├── database/                   # PostgreSQL schema, migrations, seed data and docs
│   ├── README.md               # Database architecture and setup guide
│   ├── schema.sql              # PostgreSQL DDL
│   ├── seed.sql                # Development seed data
│   └── migrations/             # Idempotent database migrations
├── server/                     # Static-template compatibility server
├── shared/                     # Shared project constants
├── ideas.md                    # Approved Field Notes design decisions
├── todo.md                     # Frontend and delivery checklist
└── README.md                   # Project overview
```

## Approved frontend routes

| Route | Purpose | Current behavior |
|---|---|---|
| `/` | Landing | Editorial introduction and entry points |
| `/register` | Register | Accessible local validation and simulated Dashboard redirect |
| `/login` | Login | Accessible local validation and simulated Dashboard redirect |
| `/dashboard` | Dashboard | Weather snapshot, feature-card navigation, mobile drawer |
| `/crop-registration` | Crop Registration | Five-step local-state flow |
| `/my-crops` | My Crop Plan | Checklist, tabs, progress ring, assistant panel |
| `/pest-detection` | Pest/Disease Detection | File preview, mock 1.5-second inference, advisory result tabs |
| `/weather` | Weather Analysis | Per-field selection, metrics, short forecast |
| `/notifications` | Notifications | Filters, unread state, mark-all-read behavior, actionable rows |

The remaining Dashboard destinations are navigable placeholders until their later page milestones are approved: Market store, Help desk, AI voice assistant, Language, and More tools.

## Design system

The selected direction is **Field Notes**, an agrarian editorial system inspired by field journals and documentary crop photography. It uses oat paper surfaces, botanical green for action and healthy states, quiet clay and sky accents, Fraunces for expressive display typography, and Manrope for readable interface text. Repeated leaf-notch marks, annotation labels, offset cards, and contour-line details create the AgroScan signature.

## Frontend development

Install dependencies and start the Vite development server:

```bash
pnpm install
pnpm dev
```

Run the frontend type check and production build:

```bash
pnpm check
pnpm build
```

The frontend uses local state and sample values for Crop Registration, My Crop Plan, Weather Analysis, and Notifications. Pest/Disease Detection calls `client/src/mock/detectCrop.ts`, which waits 1.5 seconds and returns one of five sample outcomes. No customer data, authentication service, weather provider, or ML model is connected in this frontend milestone.

## Database quick start

Refer to the complete [Database Documentation](database/README.md) for architecture, schema details, and backend connection examples.

To initialize the PostgreSQL database in a development environment:

```bash
psql -U postgres -d agroscan -f database/schema.sql
psql -U postgres -d agroscan -f database/seed.sql
```

The separate FastAPI, PostgreSQL, JWT, storage, and model-training phase should be started only after the complete frontend is approved and the dataset location, deployment target, and integration requirements are confirmed.
