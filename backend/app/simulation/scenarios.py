"""
SentinelX AI — Cyber Defense Simulation Scenarios
Author: Yashpreet Singh (2026)
"""
import random
import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.entities import Endpoint, SecurityEvent, Incident, Honeypot, HoneypotEvent, ThreatIndicator
from app.services.audit_logger import audit_logger
from app.services.risk_engine import risk_engine
from app.schemas.schemas import RiskSignalInput

class ScenarioGenerator:
    @staticmethod
    def simulate_normal_user(db: Session) -> Dict[str, Any]:
        endpoint = db.query(Endpoint).filter(Endpoint.hostname == "Endpoint-01").first()
        now = datetime.now(timezone.utc)
        ev = SecurityEvent(
            timestamp=now,
            event_type="NORMAL_LOGIN",
            source="Internal-vLAN-10.0.4.12",
            target="Authentication-Service",
            endpoint_id=endpoint.id if endpoint else None,
            severity="LOW",
            risk_impact=4.0,
            raw_data_json={
                "user": "developer_jdoe",
                "login_hour": 9.2,
                "device_id": "DEV-CORP-LAPTOP-01",
                "mfa_verified": True
            }
        )
        db.add(ev)
        if endpoint:
            endpoint.risk_score = 12.0
            endpoint.status = "ONLINE"
        db.commit()
        audit_logger.log(db, "TELEMETRY_LOGGED", "Endpoint-01", "Routine user authentication verified", 12.0, "TELEMETRY_AGENT")
        return {"scenario": "Normal User", "status": "COMPLETED", "risk": 12.0, "message": "Baseline telemetry recorded for Endpoint-01."}

    @staticmethod
    def simulate_suspicious_login(db: Session) -> Dict[str, Any]:
        endpoint = db.query(Endpoint).filter(Endpoint.hostname == "Endpoint-02").first()
        now = datetime.now(timezone.utc)
        ev = SecurityEvent(
            timestamp=now,
            event_type="ABNORMAL_LOGIN",
            source="198.51.100.44 (Synthetic External)",
            target="SSH-Gateway",
            endpoint_id=endpoint.id if endpoint else None,
            severity="MEDIUM",
            risk_impact=58.0,
            raw_data_json={
                "user": "sysadmin_sim",
                "login_hour": 3.25,
                "new_device": True,
                "failed_attempts": 4
            }
        )
        db.add(ev)
        if endpoint:
            endpoint.risk_score = 58.0
            endpoint.status = "SUSPICIOUS"
        db.commit()
        audit_logger.log(db, "ANOMALY_RECORDED", "Endpoint-02", "Off-hours login from untrusted IP", 58.0, "ANOMALY_ENGINE")
        return {"scenario": "Suspicious Login", "status": "COMPLETED", "risk": 58.0, "message": "Suspicious login event recorded on Endpoint-02."}

    @staticmethod
    def simulate_credential_anomaly(db: Session) -> Dict[str, Any]:
        endpoint = db.query(Endpoint).filter(Endpoint.hostname == "Endpoint-04").first()
        now = datetime.now(timezone.utc)
        ev = SecurityEvent(
            timestamp=now,
            event_type="CREDENTIAL_SPRAY_ATTEMPT",
            source="192.0.2.19 (Synthetic Gateway)",
            target="Active-Directory-Decoy",
            endpoint_id=endpoint.id if endpoint else None,
            severity="HIGH",
            risk_impact=72.0,
            raw_data_json={
                "failed_logins_count": 18,
                "unique_usernames_tested": 12,
                "time_window_seconds": 30
            }
        )
        db.add(ev)
        if endpoint:
            endpoint.risk_score = 72.0
            endpoint.status = "SUSPICIOUS"
        db.commit()
        audit_logger.log(db, "CREDENTIAL_ANOMALY_DETECTED", "Endpoint-04", "Simulated credential stuffing pattern intercepted", 72.0, "RISK_ENGINE")
        return {"scenario": "Credential Anomaly", "status": "COMPLETED", "risk": 72.0, "message": "Simulated credential spray recorded on Endpoint-04."}

    @staticmethod
    def simulate_honeypot_interaction(db: Session) -> Dict[str, Any]:
        honeypot = db.query(Honeypot).filter(Honeypot.name == "fake-finance-share").first()
        endpoint = db.query(Endpoint).filter(Endpoint.hostname == "Endpoint-07").first()
        now = datetime.now(timezone.utc)
        
        if honeypot:
            honeypot.interaction_count += 1
            honeypot.last_interaction = now

        h_ev = HoneypotEvent(
            honeypot_id=honeypot.id if honeypot else 1,
            endpoint_id=endpoint.id if endpoint else None,
            action="Resource Enumeration & SMB Canary Access",
            synthetic_source_ip=endpoint.synthetic_ip if endpoint else "10.0.12.77",
            payload_summary="Attacker enumerated synthetic payroll_q3_2026.xlsx honey-file",
            risk_score=92.0,
            confidence_score=96.0,
            timestamp=now
        )
        db.add(h_ev)

        ev = SecurityEvent(
            timestamp=now,
            event_type="HONEYPOT_INTERACTION",
            source=endpoint.hostname if endpoint else "Endpoint-07",
            target="fake-finance-share",
            endpoint_id=endpoint.id if endpoint else None,
            severity="CRITICAL",
            risk_impact=92.0,
            raw_data_json={"canary_file": "payroll_q3_2026.xlsx", "trap_id": "CANARY-SMB-002"}
        )
        db.add(ev)
        if endpoint:
            endpoint.risk_score = 92.0
            endpoint.status = "SUSPICIOUS"

        db.commit()
        audit_logger.log(db, "HONEYPOT_TRIPWIRE_TRIGGERED", "fake-finance-share", "Decoy interaction from Endpoint-07", 92.0, "DIGITAL_LABYRINTH")
        return {"scenario": "Honeypot Interaction", "status": "COMPLETED", "risk": 92.0, "message": "Attacker decoy interaction recorded in Digital Labyrinth."}

    @staticmethod
    def simulate_process_anomaly(db: Session) -> Dict[str, Any]:
        endpoint = db.query(Endpoint).filter(Endpoint.hostname == "Endpoint-05").first()
        now = datetime.now(timezone.utc)
        ev = SecurityEvent(
            timestamp=now,
            event_type="PROCESS_ANOMALY",
            source="Endpoint-05 (PID: 8841)",
            target="Simulated-Mining-Daemon",
            endpoint_id=endpoint.id if endpoint else None,
            severity="HIGH",
            risk_impact=78.0,
            raw_data_json={
                "process_name": "xmrig_synthetic_test.bin",
                "cpu_utilization": 98.4,
                "parent_pid": 1102
            }
        )
        db.add(ev)
        if endpoint:
            endpoint.risk_score = 78.0
            endpoint.status = "SUSPICIOUS"
        db.commit()
        audit_logger.log(db, "PROCESS_ISOLATION_RECOMMENDED", "Endpoint-05", "High CPU anomalous synthetic process detected", 78.0, "EDR_SIMULATOR")
        return {"scenario": "Process Anomaly", "status": "COMPLETED", "risk": 78.0, "message": "Anomalous synthetic process flagged on Endpoint-05."}

    @staticmethod
    def simulate_phishing(db: Session) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        ev = SecurityEvent(
            timestamp=now,
            event_type="PHISHING_DETECTED",
            source="security-alert-urgent@paypa1-security.com",
            target="corporate-inbox",
            endpoint_id=None,
            severity="HIGH",
            risk_impact=82.0,
            raw_data_json={
                "subject": "URGENT: Your Corporate Access Expires in 24 Hours",
                "verdict": "HIGH_RISK",
                "indicator": "http://198.51.100.99/auth-login"
            }
        )
        db.add(ev)
        db.commit()
        audit_logger.log(db, "PHISHING_INTERCEPTED", "Corporate Mail Filter", "Suspicious credential lure quarantined", 82.0, "SCAM_BAIT_ENGINE")
        return {"scenario": "Phishing Attack", "status": "COMPLETED", "risk": 82.0, "message": "Synthetic phishing message analyzed and quarantined."}

    @staticmethod
    def simulate_critical_incident(db: Session) -> Dict[str, Any]:
        endpoint = db.query(Endpoint).filter(Endpoint.hostname == "Endpoint-06").first()
        now = datetime.now(timezone.utc)
        code = f"INC-2026-{random.randint(1000, 9999)}"
        inc = Incident(
            incident_code=code,
            title="Correlated Ransomware Simulation Infiltration",
            severity="CRITICAL",
            status="INVESTIGATING",
            endpoint_id=endpoint.id if endpoint else None,
            detection_method="Multi-Signal Risk Correlator",
            risk_score=89.0,
            confidence_score=94.0,
            evidence_json=[
                "Rapid file entropy increase across 240 synthetic documents",
                "Canary file modification in decoy directory",
                "Unusual lateral SMB probe attempt"
            ],
            recommended_action="QUARANTINE",
            action_taken="CONTAINMENT_PENDING"
        )
        db.add(inc)
        if endpoint:
            endpoint.risk_score = 89.0
            endpoint.status = "SUSPICIOUS"
        db.commit()
        audit_logger.log(db, "CRITICAL_INCIDENT_ESCALATED", code, "Correlated high-confidence intrusion pattern", 89.0, "RISK_ENGINE")
        return {"scenario": "Critical Incident", "status": "COMPLETED", "risk": 89.0, "incident_code": code}

scenarios = ScenarioGenerator()
