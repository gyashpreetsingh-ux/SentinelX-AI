"""
SentinelX AI — Backend Test Suite
Author: Yashpreet Singh (2026)
"""
import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure backend folder is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database.session import SessionLocal
from app.models.entities import Endpoint, Policy, Incident, AuditLog
from app.services.risk_engine import risk_engine
from app.schemas.schemas import RiskSignalInput
from app.ml.anomaly_detector import anomaly_engine

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["author"] == "Yashpreet Singh"
    assert data["engines"]["detection_engine"] == "ONLINE"

def test_authentication_flow():
    # Test valid login
    response = client.post("/api/auth/login", json={
        "username": "admin@sentinelx.ai",
        "password": "Admin@SentinelX2026"
    })
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["role"] == "ADMIN"
    token = token_data["access_token"]

    # Test /api/auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_response = client.get("/api/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["username"] == "admin"

    # Test invalid login
    bad_response = client.post("/api/auth/login", json={
        "username": "admin@sentinelx.ai",
        "password": "WrongPassword123"
    })
    assert bad_response.status_code == 401

def test_ml_anomaly_detection():
    # Baseline session (normal)
    normal_res = anomaly_engine.analyze({
        "login_hour": 9.0,
        "session_duration": 7.5,
        "files_accessed": 20,
        "failed_logins": 0,
        "new_device": False,
        "resource_access_rate": 1.0,
        "typing_deviation": 0.1,
        "mouse_deviation": 0.1,
        "network_activity": 15.0,
        "honeypot_interaction": False
    })
    assert normal_res["risk_score"] < 40.0
    assert normal_res["recommended_action"] in ["ALLOW", "STEP_UP_VERIFICATION"]

    # Anomalous session
    anomaly_res = anomaly_engine.analyze({
        "login_hour": 3.14,
        "session_duration": 1.0,
        "files_accessed": 350,
        "failed_logins": 7,
        "new_device": True,
        "resource_access_rate": 4.5,
        "typing_deviation": 0.85,
        "mouse_deviation": 0.80,
        "network_activity": 150.0,
        "honeypot_interaction": True
    })
    assert anomaly_res["anomaly_detected"] is True
    assert anomaly_res["risk_score"] >= 85.0
    assert anomaly_res["confidence_score"] >= 90.0
    assert anomaly_res["severity"] == "CRITICAL"
    assert anomaly_res["recommended_action"] == "QUARANTINE"
    assert "explanation" in anomaly_res

def test_risk_scoring_engine():
    # High risk multi-signal
    input_signals = RiskSignalInput(
        behavior_anomaly=90.0,
        auth_anomaly=85.0,
        endpoint_anomaly=80.0,
        network_anomaly=75.0,
        honeypot_interaction=95.0,
        threat_intel_match=60.0
    )
    result = risk_engine.calculate(input_signals)
    assert result.risk_score >= 85.0
    assert result.confidence_score >= 90.0
    assert result.severity == "CRITICAL"
    assert result.recommended_action == "QUARANTINE"
    assert len(result.evidence_list) >= 4

def test_policy_evaluation_and_update():
    # Read policies
    res = client.get("/api/policies")
    assert res.status_code == 200
    policies = res.json()
    assert len(policies) >= 3

    # Update policy condition
    policy_id = policies[0]["id"]
    update_res = client.put(f"/api/policies/{policy_id}", json={
        "condition_risk_min": 85.0,
        "condition_confidence_min": 90.0
    })
    assert update_res.status_code == 200
    assert update_res.json()["condition_risk_min"] == 85.0

def test_honeypot_interaction_simulation():
    res = client.post("/api/honeypots/simulate", json={
        "honeypot_id": 2,
        "endpoint_hostname": "Endpoint-07",
        "action": "Canary Payroll File Tampering"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["risk_score"] >= 90.0
    assert data["confidence_score"] >= 90.0

def test_self_heal_containment_and_recovery():
    # Quarantine Endpoint-02
    q_res = client.post("/api/response/quarantine?endpoint_id=2&reason=Automated%20test%20quarantine")
    assert q_res.status_code == 200
    q_data = q_res.json()
    assert q_data["current_status"] == "QUARANTINED"
    assert "isolation_details" in q_data

    # Recover Endpoint-02
    r_res = client.post("/api/recovery/start", json={
        "endpoint_id": 2,
        "snapshot_id": "Snapshot-2026-09-18-0900"
    })
    assert r_res.status_code == 200
    r_data = r_res.json()
    assert r_data["status"] == "SUCCESS"
    assert r_data["progress_percent"] == 100

def test_phishing_analysis():
    # High-risk phish
    res = client.post("/api/phishing/analyze", json={
        "sender": "security-alert@paypa1-security.com",
        "subject": "URGENT: Your account suspended in 24 hours",
        "body": "Please enter password and confirm credentials immediately at https://paypa1-security.com/login"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["classification"] == "HIGH_RISK"
    assert data["risk_score"] >= 70.0
    assert data["recommended_action"] == "QUARANTINE"

    # Safe email
    safe_res = client.post("/api/phishing/analyze", json={
        "sender": "team@internalcorp.com",
        "subject": "Weekly Team Catchup",
        "body": "Hi everyone, see you at the weekly project sync at 2 PM."
    })
    assert safe_res.status_code == 200
    safe_data = safe_res.json()
    assert safe_data["classification"] == "SAFE"

def test_flagship_16_step_autonomous_defense():
    # Run full 16-step autonomous defense simulation
    res = client.post("/api/simulation/full-defense")
    assert res.status_code == 200
    data = res.json()
    assert data["total_steps"] == 16
    assert data["success"] is True
    assert data["target_endpoint"] == "Endpoint-03"
    assert data["final_risk"] == 94.0
    assert data["final_confidence"] == 97.0
    assert len(data["steps"]) == 16

    # Verify each step is completed
    for step in data["steps"]:
        assert step["status"] == "COMPLETED"
        assert step["step_number"] >= 1 and step["step_number"] <= 16

def test_audit_logs_recorded():
    res = client.get("/api/audit")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] > 0
    assert len(data["items"]) > 0
