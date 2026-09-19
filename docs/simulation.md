# SentinelX AI — Cyber Defense Simulation Laboratory

**Author**: Yashpreet Singh (2026)  
**Platform**: SentinelX AI — Next-Gen Autonomous Cyber Defense Platform

---

## 1. Purpose of the Simulation Lab
The Simulation Lab allows security analysts, educators, and evaluators to test defensive responses against realistic synthetic attack patterns without needing real malware or risking production outages.

---

## 2. Modular Attack Scenarios
1. **Normal User Simulation**:
   - Baseline morning login at 09:12 AM with MFA verified and routine file usage.
   - Evaluates to Risk 12/100 (LOW).
2. **Suspicious Login Simulation**:
   - Off-hours login at 03:14 AM from untrusted external IP with 4 failed attempts.
   - Evaluates to Risk 58/100 (MEDIUM).
3. **Credential Anomaly Simulation**:
   - Rapid credential spraying attempt targeting Active Directory decoy.
   - Evaluates to Risk 72/100 (HIGH).
4. **Honeypot Decoy Interaction**:
   - Direct attacker hit against Digital Labyrinth `fake-finance-share`.
   - Evaluates to Risk 92/100 (CRITICAL).
5. **Process Anomaly Simulation**:
   - Spawns anomalous high-CPU synthetic daemon (`xmrig_synthetic_test.bin`).
   - Evaluates to Risk 78/100 (HIGH).
6. **Phishing Simulation**:
   - Ingestion of high-urgency executive credential lure email.
   - Evaluates to Risk 82/100 (HIGH).
7. **Critical Multi-Vector Breach**:
   - High-entropy ransomware simulation with simultaneous file encryption.
   - Evaluates to Risk 89/100 (CRITICAL).

---

## 3. Flagship 16-Step Autonomous Defense Lifecycle
When the user clicks **RUN FULL AUTONOMOUS DEFENSE**, SentinelX AI executes:

| Step | Title | Target / Engine | State Action |
|---|---|---|---|
| 01 | Abnormal Login | Endpoint-03 | Off-hours session recorded (03:14 AM) |
| 02 | Unrecognized Device | Endpoint-03 | Hardware signature mismatch |
| 03 | Mass File Access | Endpoint-03 | 350 documents touched |
| 04 | Process Anomaly | Endpoint-03 | Unauthorized daemon spawn flagged |
| 05 | Decoy Tripwire Hit | fake-finance-share | Canary honeytoken triggered |
| 06 | ML Analysis | Isolation Forest | Anomaly score evaluated |
| 07 | Risk Engine Scoring | Risk Engine | Calculated Risk: 94, Confidence: 97% |
| 08 | Policy Evaluation | Policy Engine | Rule "Auto Quarantine Critical" matched |
| 09 | Endpoint Quarantine | Endpoint-03 | Status: ONLINE -> QUARANTINED |
| 10 | Evidence Preserved | Evidence Vault | Volatile state locked (SHA-256) |
| 11 | Recovery Initialized | Recovery Engine | Status: QUARANTINED -> RECOVERING |
| 12 | Snapshot Selected | Snapshot Registry| Clean baseline Snapshot-2026-09-18-0900 |
| 13 | Integrity Verified | Verification Engine | Hash matches golden baseline |
| 14 | Host Restored | Endpoint-03 | Status: RECOVERING -> RECOVERED |
| 15 | Incident Resolved | Incident Manager | Status: RESOLVED |
| 16 | Audit Committed | Audit Ledger | Immutable record written to SQLite |

---

© 2026 Yashpreet Singh. SentinelX AI — Autonomous Cyber Defense Platform.
