"""
SentinelX AI — Pydantic Schemas
Author: Yashpreet Singh (2026)
"""
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# Auth
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Endpoints
class EndpointResponse(BaseModel):
    id: int
    hostname: str
    os_name: str
    synthetic_ip: str
    status: str
    risk_score: float
    last_seen: datetime
    processes_json: List[Dict[str, Any]] = []
    isolation_details: Dict[str, Any] = {}
    trusted_snapshot: str

    model_config = ConfigDict(from_attributes=True)

# Security Events
class SecurityEventResponse(BaseModel):
    id: int
    timestamp: datetime
    event_type: str
    source: str
    target: str
    endpoint_id: Optional[int]
    severity: str
    risk_impact: float
    raw_data_json: Dict[str, Any] = {}

    model_config = ConfigDict(from_attributes=True)

# Honeypots
class HoneypotResponse(BaseModel):
    id: int
    name: str
    decoy_type: str
    synthetic_path: str
    status: str
    interaction_count: int
    last_interaction: Optional[datetime]
    fake_payload_summary: str

    model_config = ConfigDict(from_attributes=True)

class HoneypotEventResponse(BaseModel):
    id: int
    honeypot_id: int
    endpoint_id: Optional[int]
    action: str
    synthetic_source_ip: str
    payload_summary: str
    risk_score: float
    confidence_score: float
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

class HoneypotSimulateRequest(BaseModel):
    honeypot_id: int
    endpoint_hostname: Optional[str] = "Endpoint-07"
    action: Optional[str] = "Resource Enumeration & Trap Trigger"

# Incidents
class IncidentResponse(BaseModel):
    id: int
    incident_code: str
    title: str
    severity: str
    status: str
    endpoint_id: Optional[int]
    detection_method: str
    risk_score: float
    confidence_score: float
    evidence_json: List[str] = []
    recommended_action: str
    action_taken: str
    recovery_status: str
    created_at: datetime
    updated_at: datetime
    endpoint_hostname: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class IncidentStatusUpdate(BaseModel):
    status: str
    action_taken: Optional[str] = None

# Behavior & ML
class BehaviorAnalysisRequest(BaseModel):
    endpoint_id: Optional[int] = 3
    login_hour: float = Field(..., ge=0.0, le=24.0)
    session_duration: float = Field(..., ge=0.0)
    files_accessed: int = Field(..., ge=0)
    failed_logins: int = Field(default=0, ge=0)
    new_device: bool = False
    resource_access_rate: float = Field(default=1.0, ge=0.0)
    typing_deviation: float = Field(default=0.1, ge=0.0, le=1.0)
    mouse_deviation: float = Field(default=0.1, ge=0.0, le=1.0)
    network_activity: float = Field(default=10.0, ge=0.0)
    honeypot_interaction: bool = False

class BehaviorAnalysisResponse(BaseModel):
    anomaly_detected: bool
    anomaly_score: float
    risk_score: float
    confidence_score: float
    severity: str
    baseline: Dict[str, Any]
    current_session: Dict[str, Any]
    deviations: Dict[str, float]
    feature_contributions: Dict[str, float]
    recommended_action: str
    explanation: str

# Risk Engine
class RiskSignalInput(BaseModel):
    behavior_anomaly: float = Field(default=0.0, ge=0.0, le=100.0)
    auth_anomaly: float = Field(default=0.0, ge=0.0, le=100.0)
    endpoint_anomaly: float = Field(default=0.0, ge=0.0, le=100.0)
    network_anomaly: float = Field(default=0.0, ge=0.0, le=100.0)
    honeypot_interaction: float = Field(default=0.0, ge=0.0, le=100.0)
    threat_intel_match: float = Field(default=0.0, ge=0.0, le=100.0)
    context_notes: Optional[str] = None

class RiskCalculationResponse(BaseModel):
    risk_score: float
    confidence_score: float
    severity: str
    recommended_action: str
    signal_contributions: Dict[str, float]
    weights_applied: Dict[str, float]
    evidence_list: List[str]
    explanation: str

# Policies
class PolicyResponse(BaseModel):
    id: int
    name: str
    condition_risk_min: float
    condition_confidence_min: float
    trigger_event: str
    action: str
    is_active: bool
    description: str
    updated_by: str
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PolicyUpdate(BaseModel):
    name: Optional[str] = None
    condition_risk_min: Optional[float] = None
    condition_confidence_min: Optional[float] = None
    action: Optional[str] = None
    is_active: Optional[bool] = None
    description: Optional[str] = None

# Recovery
class RecoveryStartRequest(BaseModel):
    endpoint_id: int
    incident_id: Optional[int] = None
    snapshot_id: Optional[str] = "Snapshot-2026-09-18-0900"

class RecoveryJobResponse(BaseModel):
    id: int
    endpoint_id: int
    incident_id: Optional[int]
    snapshot_id: str
    status: str
    progress_percent: int
    logs_json: List[str] = []
    started_at: datetime
    completed_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

# Phishing / Scam-Bait
class PhishingAnalysisRequest(BaseModel):
    sender: str
    subject: str
    body: str

class PhishingAnalysisResponse(BaseModel):
    classification: str  # SAFE, SUSPICIOUS, HIGH_RISK
    risk_score: float
    confidence_score: float
    indicators_found: List[str]
    reasons: List[str]
    recommended_action: str
    synthetic_threat_signature: str

# Threat Intelligence
class ThreatIndicatorResponse(BaseModel):
    id: int
    indicator: str
    category: str
    severity: str
    confidence: float
    first_seen: datetime
    last_seen: datetime
    status: str
    source: str

    model_config = ConfigDict(from_attributes=True)

# Audit
class AuditLogResponse(BaseModel):
    id: int
    timestamp: datetime
    username: str
    action: str
    target: str
    reason: str
    risk_score: float
    result: str

    class Config:
        from_attributes = True

# Simulation Workflow
class DefenseWorkflowStep(BaseModel):
    step_number: int
    title: str
    status: str  # PENDING, IN_PROGRESS, COMPLETED, FAILED
    icon: str
    timestamp: str
    details: str
    evidence: Optional[str] = None
    state_change: Optional[Dict[str, Any]] = None

class FullDefenseWorkflowResponse(BaseModel):
    workflow_id: str
    total_steps: int
    success: bool
    incident_code: str
    target_endpoint: str
    final_risk: float
    final_confidence: float
    steps: List[DefenseWorkflowStep]
    execution_time_ms: float

# Dashboard
class DashboardSummaryResponse(BaseModel):
    active_threats: int
    critical_incidents: int
    monitored_endpoints: int
    contained_threats: int
    recovery_success_rate: float
    average_response_time_sec: float
    system_status: Dict[str, str]
    threats_over_time: List[Dict[str, Any]]
    risk_distribution: List[Dict[str, Any]]
    incident_severity_distribution: List[Dict[str, Any]]
    endpoint_risk_matrix: List[Dict[str, Any]]
    detection_sources: List[Dict[str, Any]]
