"""
SentinelX AI — Digital Labyrinth Honeypot Simulation API Endpoints
Author: Yashpreet Singh (2026)
"""
from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import Honeypot, HoneypotEvent, SecurityEvent, Endpoint
from app.schemas.schemas import HoneypotResponse, HoneypotEventResponse, HoneypotSimulateRequest
from app.services.audit_logger import audit_logger

router = APIRouter(prefix="/honeypots", tags=["Digital Labyrinth"])

@router.get("", response_model=List[HoneypotResponse])
def list_honeypots(db: Session = Depends(get_db)):
    return db.query(Honeypot).all()

@router.get("/events", response_model=List[HoneypotEventResponse])
def get_honeypot_events(limit: int = 20, db: Session = Depends(get_db)):
    return db.query(HoneypotEvent).order_by(HoneypotEvent.timestamp.desc()).limit(limit).all()

@router.post("/simulate")
def simulate_honeypot_interaction(req: HoneypotSimulateRequest, db: Session = Depends(get_db)):
    honeypot = db.query(Honeypot).filter(Honeypot.id == req.honeypot_id).first()
    if not honeypot:
        raise HTTPException(status_code=404, detail="Honeypot decoy not found")

    endpoint = db.query(Endpoint).filter(Endpoint.hostname == req.endpoint_hostname).first()
    now = datetime.now(timezone.utc)

    honeypot.interaction_count += 1
    honeypot.last_interaction = now

    h_event = HoneypotEvent(
        honeypot_id=honeypot.id,
        endpoint_id=endpoint.id if endpoint else None,
        action=req.action or "Decoy Canary Token Access",
        synthetic_source_ip=endpoint.synthetic_ip if endpoint else "10.0.1.16",
        payload_summary=f"Simulated attacker accessed decoy trap resource '{honeypot.name}' ({honeypot.synthetic_path}).",
        risk_score=92.0,
        confidence_score=96.0,
        timestamp=now
    )
    db.add(h_event)

    # Correlated security event
    sec_event = SecurityEvent(
        timestamp=now,
        event_type="HONEYPOT_INTERACTION",
        source=endpoint.hostname if endpoint else "Endpoint-07",
        target=honeypot.name,
        endpoint_id=endpoint.id if endpoint else None,
        severity="CRITICAL",
        risk_impact=92.0,
        raw_data_json={
            "decoy_id": honeypot.id,
            "synthetic_path": honeypot.synthetic_path,
            "action": req.action
        }
    )
    db.add(sec_event)

    if endpoint:
        endpoint.risk_score = 92.0
        endpoint.status = "SUSPICIOUS"

    db.commit()
    db.refresh(h_event)

    audit_logger.log(
        db=db,
        action="HONEYPOT_TRIPWIRE_TRIGGERED",
        target=honeypot.name,
        reason=f"Decoy interaction from {req.endpoint_hostname}",
        risk_score=92.0,
        username="SIMULATION_ENGINE",
        result="SUCCESS"
    )

    return {
        "success": True,
        "message": f"Simulated attack triggered against {honeypot.name}.",
        "event_id": h_event.id,
        "risk_score": 92.0,
        "confidence_score": 96.0,
        "honeypot_name": honeypot.name,
        "source_endpoint": req.endpoint_hostname
    }
