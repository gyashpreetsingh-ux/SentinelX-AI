# SentinelX AI — Next-Gen Autonomous Cyber Defense Platform

> **Detect. Understand. Contain. Recover. Learn.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178c6.svg)](https://www.typescriptlang.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Isolation--Forest-F7931E.svg)](https://scikit-learn.org/)

**Author**: **Yashpreet Singh**  
**Year**: **2026**  
**Project**: **SentinelX AI — Next-Gen Autonomous Cyber Defense Platform**

---

## 🛡️ Overview

**SentinelX AI** is a privacy-first autonomous cybersecurity platform engineered to behave like a controlled 24/7 digital Security Operations Center (SOC) team. It continuously processes simulated enterprise security telemetry, isolates abnormal user behavior, correlates disparate threat signals, calculates normalized risk and confidence, takes policy-governed defensive containment actions, preserves volatile evidence, executes automated rollback from trusted snapshots, and audits every lifecycle event.

This application is engineered strictly for **authorized defensive environments**, cybersecurity labs, portfolio showcases, hackathons (SIH-style), and research demonstrations using 100% synthetic telemetry.

---

## 🎯 The Problem & The Solution

- **Alert Fatigue**: SOC analysts face thousands of disconnected alerts daily. SentinelX AI unifies multi-sensor telemetry into weighted risk scores with statistical certainty.
- **Privacy Concerns**: Traditional platforms stream internal logs to third-party LLMs. SentinelX AI utilizes **local machine learning** (scikit-learn Isolation Forest) that never leaks enterprise telemetry.
- **Slow Response Times**: Attackers move in minutes; humans respond in hours. SentinelX AI executes policy-controlled virtual containment and snapshot restoration in under 15 seconds.
- **Black-Box AI**: Security teams resist opaque recommendations. SentinelX AI features **Explainable AI (XAI)** cards explaining WHAT happened, WHY it is suspicious, WHAT evidence contributed, and WHAT defensive policy was enforced.

---

## ⚡ Core Features

1. **SOC Command Center Dashboard (`/dashboard`)**: Live KPI metrics (Active Threats, Contained Threats, Recovery Rate), Recharts temporal activity curves, fleet risk distribution, and live append-only event stream.
2. **Ghost Pattern — Behavioral Anomaly Detection (`/behavior`)**: Tracks login hours, session durations, file access bursts, failed logins, device novelty, and typing variance against historical user baselines.
3. **Digital Labyrinth — Deception Decoy Network (`/honeypots`)**: Deploys canary traps (`fake-admin-panel`, `fake-finance-share`, `fake-database`, `fake-api-key-store`, `fake-server-console`) with one-click interactive attacker simulation.
4. **Multi-Signal Risk Engine (`/risk-engine`)**: Correlates 6 weighted signal vectors (Behavior, Auth, EDR, Network, Honeypot, Threat Intel) into normalized 0–100 risk and confidence ratings.
5. **Self-Heal — Containment & Recovery (`/response`)**: Simulated virtual network isolation (`eth0_isolated`), volatile evidence locking (`SHA256-SYNTHETIC-...`), and automated snapshot rollback.
6. **Scam-Bait — Phishing Analyzer (`/phishing`)**: Heuristic scanner evaluating urgency, credential harvesting lures, deceptive URLs, and dangerous file extensions.
7. **Predictive Hunt — Threat Intelligence (`/threat-intelligence`)**: Filterable feed of synthetic threat indicators, severities, confidence ratings, and reputation statuses.
8. **Policy Engine (`/policies`)**: Visual threshold editor allowing administrators to define auto-quarantine rules with mandatory audit trail logging.
9. **Tamper-Evident Audit Logs (`/audit`)**: Append-only journal recording every operator and autonomous system decision.
10. **Cyber Defense Simulation Lab (`/simulation`)**: The flagship demonstration workbench featuring modular attack injectors and the **16-Step Animated Full Autonomous Defense** workflow.
11. **Interactive Architecture Visualizer (`/architecture`)**: 5-tier architecture map from sensing through visibility.
12. **Settings & Threshold Tuning (`/settings`)**: Platform configurations for ML contamination factors, quarantine sensitivity, and health diagnostics.
13. **About & Safety Principles (`/about`)**: Complete author accreditation, mission statement, and ethical guardrails.

---

## 🏛️ System Architecture

```
DATA LAYER
├─ Virtual Endpoint Telemetry (Endpoints 01-08)
├─ Authentication Events & Sessions
├─ Network Sockets & Metadata
├─ Inbound Email Messages (Scam-Bait)
└─ Digital Labyrinth Honeytokens
   │
   ▼
AI & HEURISTIC LAYER
├─ Local Scikit-Learn Isolation Forest (150 Trees)
├─ Ghost Pattern Continuous Profiling
├─ Explainable AI (XAI) Attribution Engine
└─ Phishing Heuristic Coercion Parser
   │
   ▼
DECISION & POLICY LAYER
├─ Multi-Signal Risk Engine (Normalized 0-100)
├─ Multi-Sensor Statistical Confidence (0-99%)
└─ Policy Evaluation Matrix (Auto-Quarantine Thresholds)
   │
   ▼
AUTONOMOUS RESPONSE LAYER
├─ Virtual Adapter Severing (Quarantine)
├─ Process Suspension & Evidence Locking
├─ Trusted Golden Snapshot Rollback (Snapshot-2026-09-18-0900)
└─ Cryptographic Baseline Integrity Verification
   │
   ▼
VISIBILITY & COMPLIANCE LAYER
├─ SOC Command Center & Telemetry Stream
├─ Incident Forensics Timeline
├─ Append-Only Immutable Audit Log Ledger
└─ Cyber Defense Simulation Laboratory
```

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router v6, Axios.
- **Backend**: Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.0, Uvicorn, Python-Jose (JWT), Passlib (Bcrypt).
- **AI / ML**: Scikit-Learn (Isolation Forest), NumPy, Pandas.
- **Database**: SQLite (Zero-configuration local development; migratable to PostgreSQL).
- **Deployment**: Docker & Docker Compose.

---

## 📂 Project Structure

```
SentinelX-AI/
├── backend/
│   ├── app/
│   │   ├── api/          # REST route handlers (auth, dashboard, simulation, etc.)
│   │   ├── core/         # Settings, JWT security & WebSocket hub
│   │   ├── database/     # SQLAlchemy engine, session & seed script
│   │   ├── ml/           # Local Isolation Forest anomaly detector & XAI
│   │   ├── models/       # Database ORM entities
│   │   ├── schemas/      # Pydantic v2 validation models
│   │   ├── services/     # Risk, Policy, Self-Heal, Recovery & Phishing engines
│   │   ├── simulation/   # Attack scenarios & 16-step defense orchestrator
│   │   └── main.py       # FastAPI application entrypoint
│   ├── tests/            # Pytest automated test suite (10/10 passing)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # StatCard, ExplanationCard, Badges
│   │   ├── context/      # AuthContext, ToastContext
│   │   ├── layouts/      # SOC DashboardLayout & Navigation
│   │   ├── pages/        # 17 interactive application pages
│   │   ├── services/     # Axios client configuration
│   │   ├── types/        # TypeScript interfaces
│   │   ├── App.tsx       # Route definitions & guards
│   │   └── main.tsx      # React root mount
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docs/                 # Architecture, API, ML, Simulation & Security docs
├── docker-compose.yml
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.12+
- Node.js v18+ and npm

### 1. Start Backend
```powershell
# Navigate to project root
cd "c:\Users\Nihal Singh\Desktop\SentinelX-AI"

# Activate Python 3.12 virtual environment
.\backend\venv\Scripts\Activate.ps1

# Run FastAPI backend on port 8088
python -m uvicorn app.main:app --app-dir backend --reload --port 8088
```
Backend will start on: `http://localhost:8088`  
Swagger API Docs: `http://localhost:8088/docs`

### 2. Start Frontend
In a new terminal:
```powershell
cd "c:\Users\Nihal Singh\Desktop\SentinelX-AI\frontend"

# Start Vite dev server on port 5188
npm run dev
```
Frontend will be live at: `http://localhost:5188`

---

## 🔑 Demo Credentials

| Role | Username / Email | Password | Access Level |
|---|---|---|---|
| **ADMIN** | `admin@sentinelx.ai` | `Admin@SentinelX2026` | Full Control (Policy tuning, simulation, containment) |
| **ANALYST** | `analyst@sentinelx.ai` | `Analyst@SentinelX2026` | Incident investigation and permitted simulations |
| **VIEWER** | `viewer@sentinelx.ai` | `Viewer@SentinelX2026` | Read-only telemetry and dashboards |

*(You can also click the quick-fill buttons on the login screen for instant demo access).*

---

## 🧪 Automated Testing

SentinelX AI includes an end-to-end backend test suite covering Authentication, ML Isolation Forest, Risk Scoring, Policy Triggers, Honeypot Canaries, Containment, Snapshot Recovery, Phishing Parsing, and the 16-Step Defense Workflow:

```powershell
.\backend\venv\Scripts\pytest.exe backend/tests -v
```
**Results**: `10 passed in 6.98s (100% PASS)`

Frontend Production Build Check:
```powershell
cd frontend
npm run build
```
**Results**: `✓ built in 11.40s (0 errors)`

---

## 🐳 Docker Deployment

Run the complete platform via Docker Compose:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

---

## 🔒 Cybersecurity Safety Disclaimer

SentinelX AI is strictly designed for **authorized defensive cybersecurity environments**, educational laboratories, research, and technical portfolio presentations.

- All endpoints (`Endpoint-01` through `Endpoint-08`) are virtual/simulated entities.
- All attack scenarios, IP addresses, credentials, files, and threat indicators are synthetic.
- Quarantine, containment, process suspension, and snapshot recovery are internal simulated application state transitions.
- The platform never attacks external systems or collects real passwords.

---

## 👨‍💻 Author & Credits

- **Author**: **Yashpreet Singh**
- **Year**: **2026**
- **Project**: **SentinelX AI — Next-Gen Autonomous Cyber Defense Platform**
- **Tagline**: *Detect. Understand. Contain. Recover. Learn.*

---

© 2026 Yashpreet Singh. SentinelX AI — Autonomous Cyber Defense Platform.
