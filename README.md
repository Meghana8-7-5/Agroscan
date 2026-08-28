# AgroScan

AgroScan is a responsive crop-care companion interface designed around a warm **Field Notes** visual language. The frontend turns a farmer’s next field action into a clear, calm step: register a crop, review a plan, scan a leaf, read the weather, or act on a notification.

## Current scope

This milestone contains the approved Part 1 frontend only. It is a client-side React application with route-based navigation, local state for interactive flows, and mock data where a backend or ML service will be connected later.

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

The remaining Dashboard destinations are intentionally navigable placeholders until their later page milestones are approved: Market store, Help desk, AI voice assistant, Language, and More tools.

## Design system

The selected direction is **Field Notes**, an agrarian editorial system inspired by field journals and documentary crop photography. It uses oat paper surfaces, botanical green for action and healthy states, quiet clay and sky accents, Fraunces for expressive display typography, and Manrope for readable interface text. Repeated leaf-notch marks, annotation labels, offset cards, and contour-line details create the AgroScan signature.

## Development

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

## Mock boundaries

The Crop Registration, My Crop Plan, Weather Analysis, and Notifications pages use local state and sample values. Pest/Disease Detection calls `client/src/mock/detectCrop.ts`, which intentionally waits 1.5 seconds before returning one of five sample outcomes. No customer data, database records, authentication service, weather provider, or ML model is connected in this frontend milestone.

The separate FastAPI, PostgreSQL, JWT, storage, and model-training phase is deferred until the complete frontend is approved and the dataset location, deployment target, and integration requirements are confirmed.
