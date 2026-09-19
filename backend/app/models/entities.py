"""
SentinelX AI — SQLAlchemy Database Models
Author: Yashpreet Singh (2026)
"""
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.session import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(32), default="VIEWER", nullable=False)  # ADMIN, ANALYST, VIEWER
    created_at = Column(DateTime, default=utc_now)

class Endpoint(Base):
    __tablename__ = "endpoints"

    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String(64), unique=True, index=True, nullable=False)
    os_name = Column(String(64), default="Ubuntu 24.04 LTS (Synthetic)")
    synthetic_ip = Column(String(45), nullable=False)
    status = Column(String(32), default="ONLINE", nullable=False)  # ONLINE, SUSPICIOUS, QUARANTINED, RECOVERING, RECOVERED
    risk_score = Column(Float, default=12.0)
    last_seen = Column(DateTime, default=utc_now)
    processes_json = Column(JSON, default=list)
    isolation_details = Column(JSON, default=dict)
    trusted_snapshot = Column(String(64), default="Snapshot-2026-09-18-0900")
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    incidents = relationship("Incident", back_populates="endpoint")
    events = relationship("SecurityEvent", back_populates="endpoint")
    recovery_jobs = relationship("RecoveryJob", back_populates="endpoint")

class BehaviorProfile(Base):
    __tablename__ = "behavior_profiles"

    id = Column(Integer, primary_key=True, index=True)
    endpoint_id = Column(Integer, ForeignKey("endpoints.id"), nullable=True)
    user_identifier = Column(String(64), index=True, nullable=False)
    baseline_login_hour = Column(Float, default=9.0)  # 09:00 AM
    session_duration_mean = Column(Float, default=7.0)  # 7 hours
    files_accessed_mean = Column(Float, default=25.0)  # 25 files/day
    failed_logins_mean = Column(Float, default=0.2)
    typing_variance = Column(Float, default=0.15)
    mouse_variance = Column(Float, default=0.18)
    sample_count = Column(Integer, default=120)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=utc_now, index=True)
    event_type = Column(String(64), index=True, nullable=False)
    source = Column(String(128), nullable=False)
    target = Column(String(128), nullable=False)
    endpoint_id = Column(Integer, ForeignKey("endpoints.id"), nullable=True)
    severity = Column(String(32), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    risk_impact = Column(Float, default=0.0)
    raw_data_json = Column(JSON, default=dict)

    endpoint = relationship("Endpoint", back_populates="events")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String(32), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    severity = Column(String(32), default="MEDIUM")  # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(32), default="NEW")  # NEW, INVESTIGATING, CONTAINED, RECOVERING, RESOLVED, FALSE_POSITIVE
    endpoint_id = Column(Integer, ForeignKey("endpoints.id"), nullable=True)
    detection_method = Column(String(64), default="Behavioral Anomaly Engine")
    risk_score = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    evidence_json = Column(JSON, default=list)
    recommended_action = Column(String(64), default="INVESTIGATE")
    action_taken = Column(String(64), default="NONE")
    recovery_status = Column(String(32), default="NOT_REQUIRED")
    created_at = Column(DateTime, default=utc_now, index=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    endpoint = relationship("Endpoint", back_populates="incidents")
    recovery_jobs = relationship("RecoveryJob", back_populates="incident")

class Honeypot(Base):
    __tablename__ = "honeypots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), unique=True, index=True, nullable=False)
    decoy_type = Column(String(64), nullable=False)  # Admin Panel, Finance Share, Database, API Key Vault, Server Console
    synthetic_path = Column(String(128), nullable=False)
    status = Column(String(32), default="ACTIVE")
    interaction_count = Column(Integer, default=0)
    last_interaction = Column(DateTime, nullable=True)
    fake_payload_summary = Column(Text, default="Synthetic canary data traps deployed.")

    events = relationship("HoneypotEvent", back_populates="honeypot")

class HoneypotEvent(Base):
    __tablename__ = "honeypot_events"

    id = Column(Integer, primary_key=True, index=True)
    honeypot_id = Column(Integer, ForeignKey("honeypots.id"), nullable=False)
    endpoint_id = Column(Integer, ForeignKey("endpoints.id"), nullable=True)
    action = Column(String(64), nullable=False)
    synthetic_source_ip = Column(String(45), nullable=False)
    payload_summary = Column(Text, nullable=False)
    risk_score = Column(Float, default=85.0)
    confidence_score = Column(Float, default=95.0)
    timestamp = Column(DateTime, default=utc_now, index=True)

    honeypot = relationship("Honeypot", back_populates="events")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), unique=True, nullable=False)
    condition_risk_min = Column(Float, default=85.0)
    condition_confidence_min = Column(Float, default=90.0)
    trigger_event = Column(String(64), default="ALL")
    action = Column(String(64), default="QUARANTINE")  # QUARANTINE, STEP_UP, RESTRICT_SESSION, ALLOW
    is_active = Column(Boolean, default=True)
    description = Column(Text, nullable=False)
    updated_by = Column(String(64), default="Yashpreet Singh")
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

class RecoveryJob(Base):
    __tablename__ = "recovery_jobs"

    id = Column(Integer, primary_key=True, index=True)
    endpoint_id = Column(Integer, ForeignKey("endpoints.id"), nullable=False)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    snapshot_id = Column(String(64), default="Snapshot-2026-09-18-0900")
    status = Column(String(32), default="QUEUED")  # QUEUED, IN_PROGRESS, VERIFYING, SUCCESS, FAILED
    progress_percent = Column(Integer, default=0)
    logs_json = Column(JSON, default=list)
    started_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)

    endpoint = relationship("Endpoint", back_populates="recovery_jobs")
    incident = relationship("Incident", back_populates="recovery_jobs")

class ThreatIndicator(Base):
    __tablename__ = "threat_indicators"

    id = Column(Integer, primary_key=True, index=True)
    indicator = Column(String(128), unique=True, index=True, nullable=False)
    category = Column(String(64), nullable=False)  # Phishing, Malware, Credential Abuse, Suspicious Login, Data Exfiltration Simulation, Endpoint Anomaly
    severity = Column(String(32), default="HIGH")  # LOW, MEDIUM, HIGH, CRITICAL
    confidence = Column(Float, default=90.0)
    first_seen = Column(DateTime, default=utc_now)
    last_seen = Column(DateTime, default=utc_now)
    status = Column(String(32), default="ACTIVE")  # ACTIVE, MITIGATED, MONITORING
    source = Column(String(64), default="SentinelX Synthetic Threat Lab")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=utc_now, index=True)
    username = Column(String(64), nullable=False)
    action = Column(String(128), nullable=False)
    target = Column(String(128), nullable=False)
    reason = Column(Text, nullable=False)
    risk_score = Column(Float, default=0.0)
    result = Column(String(64), default="SUCCESS")
