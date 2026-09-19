# SentinelX AI — REST API Reference

**Author**: Yashpreet Singh (2026)  
**Base URL**: `http://localhost:8000`  
**Interactive Docs**: `http://localhost:8000/docs` (Swagger UI)

---

## Authentication Endpoints
- `POST /api/auth/login`: Authenticate with username/email and password, returns JWT bearer token.
- `GET /api/auth/me`: Get current authenticated user profile.
- `POST /api/auth/logout`: Revoke active session.

## SOC Dashboard Endpoints
- `GET /api/dashboard/summary`: Comprehensive KPI metrics, risk distributions, and temporal trends.
- `GET /api/dashboard/events`: Live security event stream with pagination.

## Behavior Analysis (Ghost Pattern)
- `GET /api/behavior/profiles`: Retrieve enterprise baseline behavioral profiles.
- `POST /api/behavior/analyze`: Evaluate real-time session telemetry vector using Isolation Forest.

## Risk & Scoring Engine
- `POST /api/risk/calculate`: Compute normalized 0–100 composite risk and confidence scores.
- `GET /api/risk/weights`: Inspect current active signal weighting parameters.
- `GET /api/risk/history`: Audit recent risk scores.

## Incidents Management
- `GET /api/incidents`: Query incidents with multi-parameter filtering, search, and pagination.
- `GET /api/incidents/{id}`: Full forensic incident breakdown, evidence lockbox, and timeline.
- `PATCH /api/incidents/{id}/status`: Transition incident lifecycle status.

## Virtual Endpoints Fleet
- `GET /api/endpoints`: Inventory of virtual host nodes.
- `GET /api/endpoints/{id}`: Detailed host telemetry, active processes, and recovery jobs.
- `PATCH /api/endpoints/{id}/state`: Update simulated operational state.

## Digital Labyrinth (Honeypots)
- `GET /api/honeypots`: List active canary traps and interaction counts.
- `GET /api/honeypots/events`: Stream canary tripwire intrusion hits.
- `POST /api/honeypots/simulate`: Trigger simulated attacker interaction against a decoy.

## Self-Heal & Containment
- `POST /api/response/quarantine`: Quarantine endpoint and isolate virtual network interfaces.
- `POST /api/response/restrict`: Issue step-up verification and restrict privileges.

## Recovery Engine
- `POST /api/recovery/start`: Dispatch automated snapshot rollback and integrity verification.
- `GET /api/recovery/jobs`: Retrieve historical and active recovery jobs.
- `GET /api/recovery/{id}`: Inspect step-by-step progress of a specific recovery job.

## Scam-Bait (Phishing)
- `GET /api/phishing/samples`: Retrieve synthetic test email samples.
- `POST /api/phishing/analyze`: Run heuristic analysis on email body and headers.

## Simulation Lab
- `GET /api/simulation/scenarios`: List all available synthetic simulation scenarios.
- `POST /api/simulation/trigger`: Execute an individual simulation scenario.
- `POST /api/simulation/full-defense`: **Flagship 16-Step Autonomous Defense** workflow execution.

## Threat Intelligence & Policies
- `GET /api/threat-intelligence`: Query threat indicators with filtering.
- `POST /api/threat-intelligence`: Add a synthetic threat indicator.
- `GET /api/policies`: List active containment and enforcement policies.
- `PUT /api/policies/{id}`: Update policy conditions (audited).

## Compliance & Audit Trail
- `GET /api/audit`: Retrieve append-only immutable audit log records.

---

© 2026 Yashpreet Singh. SentinelX AI — Autonomous Cyber Defense Platform.
