"""
SentinelX AI — Risk Engine API Endpoints
Author: Yashpreet Singh (2026)
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import Incident, Endpoint, SecurityEvent
from app.schemas.schemas import RiskSignalInput, RiskCalculationResponse
from app.services.risk_engine import risk_engine, WEIGHTS

router = APIRouter(prefix="/risk", tags=["Risk Engine"])

@router.post("/calculate", response_model=RiskCalculationResponse)
def calculate_risk_score(signals: RiskSignalInput):
    return risk_engine.calculate(signals)

@router.get("/weights")
def get_risk_weights():
    return {
        "weights": WEIGHTS,
        "classifications": {
            "LOW": "0 - 29",
            "MEDIUM": "30 - 59",
            "HIGH": "60 - 79",
            "CRITICAL": "80 - 100"
        }
    }

@router.get("/history")
def get_risk_history(db: Session = Depends(get_db)):
    # Pull recent incidents with risk and confidence scores
    recent = db.query(Incident).order_by(Incident.created_at.desc()).limit(15).all()
    endpoints = {ep.id: ep.hostname for ep in db.query(Endpoint).all()}
    return [
        {
            "id": inc.id,
            "incident_code": inc.incident_code,
            "title": inc.title,
            "hostname": endpoints.get(inc.endpoint_id, "Unknown"),
            "risk_score": inc.risk_score,
            "confidence_score": inc.confidence_score,
            "severity": inc.severity,
            "detection_method": inc.detection_method,
            "status": inc.status,
            "created_at": inc.created_at
        }
        for inc in recent
    ]
