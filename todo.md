# AgroScan Build Checklist

## Part 1 — Frontend

- [x] Initialize the React/Vite static project and shared routing shell.
- [x] Establish the Field Notes visual system, responsive typography, and shared navigation pattern.
- [x] Build and verify the Landing page.
- [x] Receive explicit Landing-page approval before building the next page.
- [x] Build and verify Register and receive explicit approval.
- [x] Build and verify Login and receive explicit approval.
- [x] Build Dashboard with route-based feature cards and receive explicit approval.
- [x] Build Crop Registration as a multi-step local-state flow and receive explicit approval.
- [x] Build My Crop Plan with checklist, tabs, and assistant panel and receive explicit approval.
- [x] Build Pest/Disease Detection with mock inference delay and result states and receive explicit approval.
- [x] Build Weather Analysis and receive explicit approval.
- [x] Build Notifications and receive explicit approval.
- [x] Run responsive verification across representative routes.
- [x] Add README.md with setup and project overview.
- [x] Complete the user-approved frontend before any backend implementation.

## Part 2 — Backend and ML (deferred)

- [ ] Confirm the user wants the separate FastAPI/PostgreSQL backend phase started after Part 1 approval.
- [ ] Confirm deployment and hosting constraints before adding backend infrastructure.
- [ ] Request the ML dataset location and folder structure before writing data-loading code.
- [ ] Choose and document the lightweight transfer-learning backbone and expected accuracy/training-time trade-offs.
- [ ] Design the FastAPI, SQLAlchemy, Alembic, JWT, storage-adapter, and CORS layers only after scope confirmation.
- [ ] Build and verify backend milestones one endpoint or subsystem at a time.
- [ ] Train, evaluate, and integrate the ML model only after dataset details are provided.
- [ ] Ask for GitHub authentication method before any push to the repository.
