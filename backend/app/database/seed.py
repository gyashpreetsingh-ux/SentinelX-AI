"""
SentinelX AI — Database Initialization & Realistic Synthetic Seed Data
Author: Yashpreet Singh (2026)
"""
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.database.session import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models.entities import (
    User, Endpoint, BehaviorProfile, SecurityEvent, Incident,
    Honeypot, HoneypotEvent, Policy, RecoveryJob, ThreatIndicator, AuditLog
)

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

def seed_data(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    now = datetime.now(timezone.utc)

    # 1. Seed Users (Documented in README)
    users = [
        User(
            username="admin",
            email="admin@sentinelx.ai",
            hashed_password=get_password_hash("Admin@SentinelX2026"),
            role="ADMIN",
            created_at=now
        ),
        User(
            username="analyst",
            email="analyst@sentinelx.ai",
            hashed_password=get_password_hash("Analyst@SentinelX2026"),
            role="ANALYST",
            created_at=now
        ),
        User(
            username="viewer",
            email="viewer@sentinelx.ai",
            hashed_password=get_password_hash("Viewer@SentinelX2026"),
            role="VIEWER",
            created_at=now
        )
    ]
    db.add_all(users)
    db.commit()

    # 2. Seed 8 Virtual Endpoints
    endpoints_data = [
        {"hostname": "Endpoint-01", "os_name": "Ubuntu 24.04 LTS", "synthetic_ip": "10.0.1.10", "status": "ONLINE", "risk_score": 12.0},
        {"hostname": "Endpoint-02", "os_name": "Windows 11 Enterprise", "synthetic_ip": "10.0.1.11", "status": "ONLINE", "risk_score": 18.0},
        {"hostname": "Endpoint-03", "os_name": "Ubuntu 24.04 LTS", "synthetic_ip": "10.0.1.12", "status": "ONLINE", "risk_score": 14.0},
        {"hostname": "Endpoint-04", "os_name": "Red Hat Linux 9", "synthetic_ip": "10.0.1.13", "status": "ONLINE", "risk_score": 22.0},
        {"hostname": "Endpoint-05", "os_name": "macOS Sonoma", "synthetic_ip": "10.0.1.14", "status": "ONLINE", "risk_score": 15.0},
        {"hostname": "Endpoint-06", "os_name": "Windows Server 2022", "synthetic_ip": "10.0.1.15", "status": "ONLINE", "risk_score": 28.0},
        {"hostname": "Endpoint-07", "os_name": "Ubuntu 24.04 LTS", "synthetic_ip": "10.0.1.16", "status": "SUSPICIOUS", "risk_score": 68.0},
        {"hostname": "Endpoint-08", "os_name": "Debian 12", "synthetic_ip": "10.0.1.17", "status": "ONLINE", "risk_score": 10.0},
    ]
    created_endpoints = []
    for ep in endpoints_data:
        endpoint = Endpoint(
            hostname=ep["hostname"],
            os_name=f"{ep['os_name']} (Synthetic)",
            synthetic_ip=ep["synthetic_ip"],
            status=ep["status"],
            risk_score=ep["risk_score"],
            last_seen=now,
            processes_json=[
                {"pid": 1, "name": "systemd", "status": "running"},
                {"pid": 412, "name": "sentinelx_agent", "status": "active"},
                {"pid": 808, "name": "sshd", "status": "listening"}
            ],
            isolation_details={},
            trusted_snapshot="Snapshot-2026-09-18-0900",
            created_at=now - timedelta(days=30)
        )
        db.add(endpoint)
        created_endpoints.append(endpoint)
    db.commit()

    # 3. Seed 5 Honeypots (Digital Labyrinth)
    honeypots = [
        Honeypot(
            name="fake-admin-panel",
            decoy_type="Admin Panel Web Decoy",
            synthetic_path="/console/v2/superadmin-portal",
            status="ACTIVE",
            interaction_count=3,
            last_interaction=now - timedelta(hours=4),
            fake_payload_summary="Synthetic canary admin credentials trap with MFA bypass honey-token."
        ),
        Honeypot(
            name="fake-finance-share",
            decoy_type="SMB File Share Decoy",
            synthetic_path="//corp-storage-01/finance-confidential-q3",
            status="ACTIVE",
            interaction_count=8,
            last_interaction=now - timedelta(hours=1),
            fake_payload_summary="Canary spreadsheets: payroll_q3_2026.xlsx and investor_roster.csv with embedded beacons."
        ),
        Honeypot(
            name="fake-database",
            decoy_type="Database Listener Decoy",
            synthetic_path="pgsql://10.0.99.12:5432/core_customers",
            status="ACTIVE",
            interaction_count=2,
            last_interaction=now - timedelta(hours=12),
            fake_payload_summary="Synthetic customer database loaded with faux credit card numbers and canary triggers."
        ),
        Honeypot(
            name="fake-api-key-store",
            decoy_type="Secrets Vault Decoy",
            synthetic_path="https://vault.internal.corp/api/v1/tokens",
            status="ACTIVE",
            interaction_count=5,
            last_interaction=now - timedelta(hours=2),
            fake_payload_summary="Faux cloud root AWS/GCP API tokens configured to alert upon any usage."
        ),
        Honeypot(
            name="fake-server-console",
            decoy_type="SSH Terminal Decoy",
            synthetic_path="ssh://10.0.99.4:2222",
            status="ACTIVE",
            interaction_count=4,
            last_interaction=now - timedelta(hours=6),
            fake_payload_summary="Interactive sandbox shell recording all simulated keystrokes and shell exploits."
        )
    ]
    db.add_all(honeypots)
    db.commit()

    # 4. Seed Honeypot Events
    h_events = [
        HoneypotEvent(
            honeypot_id=2,  # fake-finance-share
            endpoint_id=7,  # Endpoint-07
            action="SMB Directory Enumeration",
            synthetic_source_ip="10.0.1.16",
            payload_summary="Read attempt on payroll_q3_2026.xlsx canary token.",
            risk_score=92.0,
            confidence_score=96.0,
            timestamp=now - timedelta(hours=1)
        ),
        HoneypotEvent(
            honeypot_id=4,  # fake-api-key-store
            endpoint_id=7,
            action="API Key Retrieval Attempt",
            synthetic_source_ip="10.0.1.16",
            payload_summary="Queried /v1/tokens honey-endpoint with curl user-agent.",
            risk_score=88.0,
            confidence_score=94.0,
            timestamp=now - timedelta(hours=2)
        )
    ]
    db.add_all(h_events)
    db.commit()

    # 5. Seed Policies
    policies = [
        Policy(
            name="Auto Quarantine Critical Threats",
            condition_risk_min=85.0,
            condition_confidence_min=90.0,
            trigger_event="ALL",
            action="QUARANTINE",
            is_active=True,
            description="Instantly sever virtual network adapter and quarantine endpoint if Risk >= 85 and Confidence >= 90%.",
            updated_by="Yashpreet Singh",
            updated_at=now
        ),
        Policy(
            name="Restrict High Risk Sessions",
            condition_risk_min=60.0,
            condition_confidence_min=75.0,
            trigger_event="BEHAVIOR_ANOMALY",
            action="RESTRICT_SESSION",
            is_active=True,
            description="Enforce step-up MFA and restrict access privileges when risk exceeds 60.",
            updated_by="Yashpreet Singh",
            updated_at=now
        ),
        Policy(
            name="Step-Up Verification on Medium Anomaly",
            condition_risk_min=30.0,
            condition_confidence_min=60.0,
            trigger_event="AUTH_ANOMALY",
            action="STEP_UP",
            is_active=True,
            description="Prompt user for biometric/hardware token verification upon anomalous off-hours access.",
            updated_by="Yashpreet Singh",
            updated_at=now
        ),
        Policy(
            name="Allow Baseline Traffic",
            condition_risk_min=0.0,
            condition_confidence_min=0.0,
            trigger_event="ROUTINE",
            action="ALLOW",
            is_active=True,
            description="Allow all regular sessions that remain strictly within normal behavioral baselines.",
            updated_by="Yashpreet Singh",
            updated_at=now
        )
    ]
    db.add_all(policies)
    db.commit()

    # 6. Seed Behavior Profiles
    for i in range(1, 9):
        bp = BehaviorProfile(
            endpoint_id=i,
            user_identifier=f"user_workstation_{i:02d}",
            baseline_login_hour=9.0 + (i * 0.1),
            session_duration_mean=7.5,
            files_accessed_mean=24.0,
            failed_logins_mean=0.1,
            typing_variance=0.12,
            mouse_variance=0.14,
            sample_count=150,
            updated_at=now
        )
        db.add(bp)
    db.commit()

    # 7. Seed 10+ Realistic Incidents
    incidents = [
        Incident(
            incident_code="INC-2026-8801",
            title="Digital Labyrinth Trap Breach on Finance Share",
            severity="CRITICAL",
            status="INVESTIGATING",
            endpoint_id=7,
            detection_method="Honeypot Tripwire",
            risk_score=92.0,
            confidence_score=96.0,
            evidence_json=[
                "Direct connection to fake-finance-share",
                "Canary file payroll_q3_2026.xlsx accessed",
                "Source IP matches Endpoint-07"
            ],
            recommended_action="QUARANTINE",
            action_taken="SESSION_RESTRICTED",
            recovery_status="NOT_REQUIRED",
            created_at=now - timedelta(hours=1),
            updated_at=now - timedelta(minutes=45)
        ),
        Incident(
            incident_code="INC-2026-7742",
            title="Credential Stuffing Vector Intercepted",
            severity="HIGH",
            status="CONTAINED",
            endpoint_id=4,
            detection_method="Authentication Anomaly Correlator",
            risk_score=76.0,
            confidence_score=88.0,
            evidence_json=[
                "18 failed authentications in 30s",
                "Dictionary user-spray signature",
                "Automated burst timing pattern"
            ],
            recommended_action="RESTRICT_SESSION",
            action_taken="IP_BLOCKED",
            recovery_status="NOT_REQUIRED",
            created_at=now - timedelta(hours=3),
            updated_at=now - timedelta(hours=2)
        ),
        Incident(
            incident_code="INC-2026-6621",
            title="Off-Hours Behavioral Shift with Mass File Touch",
            severity="HIGH",
            status="RESOLVED",
            endpoint_id=2,
            detection_method="Ghost Pattern ML Engine",
            risk_score=71.0,
            confidence_score=85.0,
            evidence_json=[
                "Login at 02:45 AM (baseline 09:15 AM)",
                "New hardware fingerprint",
                "140 files accessed in 10 minutes"
            ],
            recommended_action="STEP_UP_VERIFICATION",
            action_taken="STEP_UP_VERIFIED",
            recovery_status="NOT_REQUIRED",
            created_at=now - timedelta(hours=18),
            updated_at=now - timedelta(hours=16)
        ),
        Incident(
            incident_code="INC-2026-5510",
            title="Synthetic Ransomware Canary Triggered & Auto-Recovered",
            severity="CRITICAL",
            status="RESOLVED",
            endpoint_id=3,
            detection_method="Self-Heal Autonomous Correlator",
            risk_score=94.0,
            confidence_score=97.0,
            evidence_json=[
                "Canary extension change detected",
                "Mass encryption simulation intercepted",
                "Trusted snapshot rollback verified"
            ],
            recommended_action="QUARANTINE_AND_RECOVER",
            action_taken="CONTAINED_AND_RECOVERED",
            recovery_status="RESTORED_VERIFIED",
            created_at=now - timedelta(days=1),
            updated_at=now - timedelta(days=1, hours=-1)
        ),
        Incident(
            incident_code="INC-2026-4409",
            title="Spear-Phishing Payload Download Intercept",
            severity="MEDIUM",
            status="RESOLVED",
            endpoint_id=5,
            detection_method="Scam-Bait Engine",
            risk_score=52.0,
            confidence_score=91.0,
            evidence_json=[
                "Urgent wire transfer lure",
                "Executable payload link paypa1-security.com",
                "Zero-click sandbox quarantine"
            ],
            recommended_action="QUARANTINE",
            action_taken="URL_BLOCKED",
            recovery_status="NOT_REQUIRED",
            created_at=now - timedelta(days=2),
            updated_at=now - timedelta(days=2, hours=-2)
        ),
        Incident(
            incident_code="INC-2026-3398",
            title="Lateral SMB Probe Pattern Detected",
            severity="MEDIUM",
            status="RESOLVED",
            endpoint_id=6,
            detection_method="Network Anomaly Engine",
            risk_score=48.0,
            confidence_score=78.0,
            evidence_json=[
                "Sequential port 445 sweeps",
                "Non-standard RPC packets",
                "Internal subnet reconnaissance"
            ],
            recommended_action="RESTRICT_SESSION",
            action_taken="NETWORK_ACL_ENFORCED",
            recovery_status="NOT_REQUIRED",
            created_at=now - timedelta(days=3),
            updated_at=now - timedelta(days=3, hours=-1)
        ),
        Incident(
            incident_code="INC-2026-2219",
            title="Anomalous High-Entropy Process Spawn",
            severity="HIGH",
            status="RESOLVED",
            endpoint_id=1,
            detection_method="EDR Process Monitor",
            risk_score=68.0,
            confidence_score=84.0,
            evidence_json=[
                "Process xmrig_synthetic_test.bin spawned",
                "High CPU utilization (99%)",
                "Parent process killed"
            ],
            recommended_action="RESTRICT_SESSION",
            action_taken="PROCESS_TERMINATED",
            recovery_status="NOT_REQUIRED",
            created_at=now - timedelta(days=4),
            updated_at=now - timedelta(days=4, hours=-3)
        ),
        Incident(
            incident_code="INC-2026-1188",
            title="Routine Token Expiration False Positive",
            severity="LOW",
            status="FALSE_POSITIVE",
            endpoint_id=8,
            detection_method="Authentication Monitor",
            risk_score=15.0,
            confidence_score=62.0,
            evidence_json=["Expired refresh token used after client sleep"],
            recommended_action="ALLOW",
            action_taken="NONE",
            recovery_status="NOT_REQUIRED",
            created_at=now - timedelta(days=5),
            updated_at=now - timedelta(days=5, hours=-1)
        ),
        Incident(
            incident_code="INC-2026-1044",
            title="Unrecognized USB Hardware Peripheral",
            severity="LOW",
            status="RESOLVED",
            endpoint_id=2,
            detection_method="Hardware Profiler",
            risk_score=24.0,
            confidence_score=75.0,
            evidence_json=["Synthetic USB vendor ID 0x1234 device attached"],
            recommended_action="ALLOW",
            action_taken="DEVICE_WHITELISTED",
            recovery_status="NOT_REQUIRED",
            created_at=now - timedelta(days=6),
            updated_at=now - timedelta(days=6, hours=-1)
        ),
        Incident(
            incident_code="INC-2026-0921",
            title="API Rate Limit Spike on Gateway",
            severity="MEDIUM",
            status="RESOLVED",
            endpoint_id=4,
            detection_method="Gateway Anomaly Monitor",
            risk_score=45.0,
            confidence_score=80.0,
            evidence_json=["450 requests/min to /api/v1/auth"],
            recommended_action="STEP_UP",
            action_taken="RATE_LIMITED",
            recovery_status="NOT_REQUIRED",
            created_at=now - timedelta(days=7),
            updated_at=now - timedelta(days=7, hours=-2)
        )
    ]
    db.add_all(incidents)
    db.commit()

    # 8. Seed 30+ Security Events
    event_templates = [
        ("NORMAL_LOGIN", "Internal-vLAN", "Auth-Server", 1, "LOW", 5.0, {"desc": "Normal morning login"}),
        ("FILE_ACCESS", "Endpoint-01", "Storage-01", 1, "LOW", 4.0, {"desc": "Routine code repository pull"}),
        ("ABNORMAL_LOGIN", "198.51.100.89", "Endpoint-03", 3, "HIGH", 68.0, {"desc": "Off-hours login"}),
        ("MASS_FILE_ACCESS", "Endpoint-03", "Storage-01", 3, "HIGH", 78.0, {"desc": "350 files touched"}),
        ("HONEYPOT_INTERACTION", "Endpoint-07", "fake-finance-share", 7, "CRITICAL", 92.0, {"desc": "Tripwire hit"}),
        ("PROCESS_ANOMALY", "Endpoint-05", "Daemon-Host", 5, "HIGH", 74.0, {"desc": "Suspicious binary execution"}),
        ("PHISHING_DETECTED", "phish@paypa1-security.com", "Mail-Gateway", None, "HIGH", 80.0, {"desc": "Credential lure email"}),
        ("CREDENTIAL_ANOMALY", "192.0.2.19", "Endpoint-04", 4, "HIGH", 72.0, {"desc": "Brute-force spray burst"}),
        ("QUARANTINE_SIMULATION", "Policy-Engine", "Endpoint-07", 7, "HIGH", 0.0, {"desc": "Policy triggered isolation"}),
        ("RECOVERY_VERIFIED", "Self-Heal", "Endpoint-03", 3, "LOW", 0.0, {"desc": "Restoration certified clean"})
    ]

    for i in range(35):
        tpl = event_templates[i % len(event_templates)]
        t_delta = timedelta(hours=(35 - i) * 2)
        ev = SecurityEvent(
            timestamp=now - t_delta,
            event_type=tpl[0],
            source=tpl[1],
            target=tpl[2],
            endpoint_id=tpl[3],
            severity=tpl[4],
            risk_impact=tpl[5],
            raw_data_json=tpl[6]
        )
        db.add(ev)
    db.commit()

    # 9. Seed Threat Indicators (Predictive Hunt)
    threat_indicators = [
        ThreatIndicator(
            indicator="198.51.100.89",
            category="Credential Abuse",
            severity="HIGH",
            confidence=94.0,
            first_seen=now - timedelta(days=14),
            last_seen=now - timedelta(hours=1),
            status="ACTIVE",
            source="SentinelX Synthetic Threat Lab"
        ),
        ThreatIndicator(
            indicator="paypa1-security.com",
            category="Phishing",
            severity="CRITICAL",
            confidence=98.0,
            first_seen=now - timedelta(days=20),
            last_seen=now - timedelta(hours=3),
            status="ACTIVE",
            source="Scam-Bait Automated Feed"
        ),
        ThreatIndicator(
            indicator="SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
            category="Malware",
            severity="CRITICAL",
            confidence=99.0,
            first_seen=now - timedelta(days=30),
            last_seen=now - timedelta(days=2),
            status="ACTIVE",
            source="EDR Synthetic Signature Database"
        ),
        ThreatIndicator(
            indicator="login-micro-soft.com",
            category="Phishing",
            severity="HIGH",
            confidence=95.0,
            first_seen=now - timedelta(days=10),
            last_seen=now - timedelta(days=1),
            status="ACTIVE",
            source="Threat Hunter Synthetic Crawler"
        ),
        ThreatIndicator(
            indicator="192.0.2.19",
            category="Suspicious Login",
            severity="MEDIUM",
            confidence=82.0,
            first_seen=now - timedelta(days=5),
            last_seen=now - timedelta(hours=6),
            status="MONITORING",
            source="Auth Anomaly Aggregator"
        ),
        ThreatIndicator(
            indicator="CANARY-SMB-TOKEN-09",
            category="Data Exfiltration Simulation",
            severity="CRITICAL",
            confidence=99.5,
            first_seen=now - timedelta(days=60),
            last_seen=now - timedelta(hours=1),
            status="ACTIVE",
            source="Digital Labyrinth Honey-Store"
        )
    ]
    db.add_all(threat_indicators)
    db.commit()

    # 10. Seed Initial Audit Logs
    audit_entries = [
        AuditLog(
            timestamp=now - timedelta(days=2),
            username="Yashpreet Singh",
            action="SYSTEM_INITIALIZED",
            target="SentinelX Core",
            reason="Platform booted with synthetic defensive test range",
            risk_score=0.0,
            result="SUCCESS"
        ),
        AuditLog(
            timestamp=now - timedelta(days=1),
            username="SYSTEM_AUTONOMOUS",
            action="POLICY_EVALUATION",
            target="Policy: Auto Quarantine Critical Threats",
            reason="Continuous threshold rule evaluation check",
            risk_score=12.0,
            result="SUCCESS"
        ),
        AuditLog(
            timestamp=now - timedelta(hours=4),
            username="analyst",
            action="INCIDENT_INVESTIGATION_START",
            target="INC-2026-8801",
            reason="Manual investigation initiated for Digital Labyrinth canary event",
            risk_score=92.0,
            result="SUCCESS"
        ),
        AuditLog(
            timestamp=now - timedelta(hours=1),
            username="POLICY_ENGINE",
            action="ENDPOINT_QUARANTINED",
            target="Endpoint-07",
            reason="Honeypot intrusion tripwire exceeded confidence 95%",
            risk_score=92.0,
            result="SUCCESS"
        )
    ]
    db.add_all(audit_entries)
    db.commit()

if __name__ == "__main__":
    init_db()
    print("Database seeded successfully with realistic synthetic telemetry.")
