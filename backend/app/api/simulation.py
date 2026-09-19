"""
SentinelX AI — Cyber Defense Simulation Lab API Endpoints
Author: Yashpreet Singh (2026)
"""
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.simulation.scenarios import scenarios
from app.simulation.orchestrator import defense_orchestrator
from app.schemas.schemas import FullDefenseWorkflowResponse

router = APIRouter(prefix="/simulation", tags=["Simulation Lab"])

AVAILABLE_SCENARIOS = [
    {
        "id": "normal_user",
        "name": "Simulate Normal User",
        "description": "Simulates standard employee morning login, expected resource access envelope, and verified MFA.",
        "category": "Baseline",
        "expected_risk": "Low (12/100)"
    },
    {
        "id": "suspicious_login",
        "name": "Simulate Suspicious Login",
        "description": "Injects off-hours login at 03:14 AM from synthetic external IP with 4 failed attempts.",
        "category": "Authentication",
        "expected_risk": "Medium (58/100)"
    },
    {
        "id": "credential_anomaly",
        "name": "Simulate Credential Anomaly",
        "description": "Simulates brute-force credential stuffing spray across multiple synthetic accounts.",
        "category": "Credential Abuse",
        "expected_risk": "High (72/100)"
    },
    {
        "id": "honeypot_interaction",
        "name": "Simulate Honeypot Interaction",
        "description": "Direct attacker interaction with Digital Labyrinth 'fake-finance-share' decoy canary file.",
        "category": "Deception Trap",
        "expected_risk": "Critical (92/100)"
    },
    {
        "id": "process_anomaly",
        "name": "Simulate Process Anomaly",
        "description": "Executes anomalous synthetic background process with elevated CPU consumption.",
        "category": "EDR Process",
        "expected_risk": "High (78/100)"
    },
    {
        "id": "phishing",
        "name": "Simulate Phishing",
        "description": "Ingests malicious lure email attempting credential harvesting and domain spoofing.",
        "category": "Email Security",
        "expected_risk": "High (82/100)"
    },
    {
        "id": "critical_incident",
        "name": "Simulate Critical Incident",
        "description": "Correlates multi-stage synthetic ransomware infiltration with high entropy changes.",
        "category": "Breach Infiltration",
        "expected_risk": "Critical (89/100)"
    },
    {
        "id": "full_autonomous_defense",
        "name": "Run Full Autonomous Defense",
        "description": "FLAGSHIP 16-Step End-to-End Autonomous Defense cycle: Detect -> AI Analyze -> Score (94/97%) -> Policy -> Quarantine -> Preserve Evidence -> Rollback Snapshot -> Verify Integrity -> Resolve -> Audit.",
        "category": "Autonomous SOC",
        "expected_risk": "Critical -> Resolved"
    }
]

@router.get("/scenarios")
def list_scenarios():
    return AVAILABLE_SCENARIOS

@router.post("/trigger")
def trigger_scenario(scenario_id: str, db: Session = Depends(get_db)):
    if scenario_id == "normal_user":
        return scenarios.simulate_normal_user(db)
    elif scenario_id == "suspicious_login":
        return scenarios.simulate_suspicious_login(db)
    elif scenario_id == "credential_anomaly":
        return scenarios.simulate_credential_anomaly(db)
    elif scenario_id == "honeypot_interaction":
        return scenarios.simulate_honeypot_interaction(db)
    elif scenario_id == "process_anomaly":
        return scenarios.simulate_process_anomaly(db)
    elif scenario_id == "phishing":
        return scenarios.simulate_phishing(db)
    elif scenario_id == "critical_incident":
        return scenarios.simulate_critical_incident(db)
    elif scenario_id == "full_autonomous_defense":
        return defense_orchestrator.run_full_autonomous_defense(db)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown scenario ID: {scenario_id}")

@router.post("/full-defense", response_model=FullDefenseWorkflowResponse)
def run_full_defense_workflow(db: Session = Depends(get_db)):
    return defense_orchestrator.run_full_autonomous_defense(db)
