# SentinelX AI — System Architecture Documentation

**Author**: Yashpreet Singh  
**Year**: 2026  
**Platform**: SentinelX AI — Next-Gen Autonomous Cyber Defense Platform  
**Tagline**: *Detect. Understand. Contain. Recover. Learn.*

---

## High-Level Architectural Flow

SentinelX AI is designed around a closed-loop autonomous defense pipeline:

```
SENSE (Telemetry) 
   │
   ▼
ANALYZE (Ghost Pattern & Local ML)
   │
   ▼
SCORE (Risk & Statistical Confidence)
   │
   ▼
ACT (Policy-Guarded Containment)
   │
   ▼
RECOVER (Trusted Snapshot Rollback)
   │
   ▼
LEARN (Baseline Update & Audit Trail)
```

---

## The 5 Defensive Layers

### 1. Data & Sensing Layer
- **Endpoint Telemetry**: Synthetic metrics from Linux, Windows, and macOS virtual hosts (login times, file counts, CPU usage).
- **Authentication Handshakes**: Ingestion of interactive and automated login events.
- **Scam-Bait Mail Parser**: Synthetic inbound emails scanned for heuristic lures.
- **Digital Labyrinth Traps**: High-fidelity canary tokens deployed on decoys.

### 2. AI & Heuristic Analysis Layer
- **Local Isolation Forest**: Unsupervised anomaly detection trained on normal enterprise envelopes (10 dimensional feature vectors).
- **Ghost Pattern**: Continuously compares active sessions against personal historical means (Z-score deviations).
- **Explainable AI (XAI)**: Calculates exact feature contributions and generates natural language explanations for every alert.

### 3. Decision & Policy Layer
- **Multi-Signal Risk Engine**: Normalizes vectors into a 0–100 scale:
  - Behavior Anomaly (20%)
  - Authentication Anomaly (15%)
  - Endpoint/EDR Anomaly (20%)
  - Network Traffic Anomaly (15%)
  - Honeypot Tripwire (25%)
  - Threat Intel Match (5%)
- **Statistical Confidence Correlator**: Separates raw risk from sensor certainty (50%–99%).
- **Policy Engine**: Evaluates active rules (e.g. *Risk >= 85 AND Confidence >= 90% -> QUARANTINE*).

### 4. Autonomous Response & Resilience Layer
- **Self-Heal Containment**: Simulates virtual network interface disconnection (`eth0_isolated`).
- **Forensic Evidence Locking**: Volatile state frozen and hashed with SHA-256 (`SHA256-SYNTHETIC-...`).
- **Snapshot Rollback**: Restores state to certified immutable golden baseline (`Snapshot-2026-09-18-0900`).
- **Integrity Verification**: Compares post-restoration file hash against known-good baseline before unquarantining.

### 5. Visibility & Compliance Layer
- **SOC Command Center**: Real-time KPI cards, area charts, severity breakdowns, and live event streams.
- **Incident Management**: Search, sort, filter, and drill into forensic incident timelines.
- **Append-Only Audit Log**: Tamper-evident ledger capturing all system and operator actions.

---

© 2026 Yashpreet Singh. SentinelX AI — Autonomous Cyber Defense Platform.
