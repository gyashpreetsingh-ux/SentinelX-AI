"""
SentinelX AI — Virtual Endpoint Inventory API Endpoints
Author: Yashpreet Singh (2026)
"""
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import Endpoint, Incident, SecurityEvent, BehaviorProfile, RecoveryJob
from app.schemas.schemas import EndpointResponse
from app.services.audit_logger import audit_logger

router = APIRouter(prefix="/endpoints", tags=["Endpoints"])

@router.get("", response_model=List[EndpointResponse])
def list_endpoints(db: Session = Depends(get_db)):
    return db.query(Endpoint).order_by(Endpoint.hostname).all()

@router.get("/{endpoint_id}")
def get_endpoint_detail(endpoint_id: int, db: Session = Depends(get_db)):
    endpoint = db.query(Endpoint).filter(Endpoint.id == endpoint_id).first()
    if not endpoint:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    # Behavior profile
    profile = db.query(BehaviorProfile).filter(BehaviorProfile.endpoint_id == endpoint.id).first()
    profile_data = {
        "baseline_login_hour": profile.baseline_login_hour if profile else 9.0,
        "session_duration_mean": profile.session_duration_mean if profile else 7.5,
        "files_accessed_mean": profile.files_accessed_mean if profile else 24.0,
        "typing_variance": profile.typing_variance if profile else 0.12,
        "mouse_variance": profile.mouse_variance if profile else 0.14
    }

    # Recent events
    events = db.query(SecurityEvent).filter(
        SecurityEvent.endpoint_id == endpoint.id
    ).order_by(SecurityEvent.timestamp.desc()).limit(15).all()

    # Associated incidents
    incidents = db.query(Incident).filter(
        Incident.endpoint_id == endpoint.id
    ).order_by(Incident.created_at.desc()).limit(10).all()

    # Recovery jobs
    recovery_jobs = db.query(RecoveryJob).filter(
        RecoveryJob.endpoint_id == endpoint.id
    ).order_by(RecoveryJob.started_at.desc()).limit(5).all()

    return {
        "endpoint": {
            "id": endpoint.id,
            "hostname": endpoint.hostname,
            "os_name": endpoint.os_name,
            "synthetic_ip": endpoint.synthetic_ip,
            "status": endpoint.status,
            "risk_score": endpoint.risk_score,
            "last_seen": endpoint.last_seen,
            "processes": endpoint.processes_json or [],
            "isolation_details": endpoint.isolation_details or {},
            "trusted_snapshot": endpoint.trusted_snapshot
        },
        "behavior_profile": profile_data,
        "events": [
            {
                "id": e.id,
                "timestamp": e.timestamp,
                "event_type": e.event_type,
                "source": e.source,
                "target": e.target,
                "severity": e.severity,
                "risk_impact": e.risk_impact
            }
            for e in events
        ],
        "incidents": [
            {
                "id": i.id,
                "incident_code": i.incident_code,
                "title": i.title,
                "severity": i.severity,
                "status": i.status,
                "risk_score": i.risk_score,
                "created_at": i.created_at
            }
            for i in incidents
        ],
        "recovery_jobs": [
            {
                "id": r.id,
                "snapshot_id": r.snapshot_id,
                "status": r.status,
                "progress_percent": r.progress_percent,
                "logs": r.logs_json,
                "started_at": r.started_at,
                "completed_at": r.completed_at
            }
            for r in recovery_jobs
        ]
    }

@router.patch("/{endpoint_id}/state")
def update_endpoint_state(
    endpoint_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    endpoint = db.query(Endpoint).filter(Endpoint.id == endpoint_id).first()
    if not endpoint:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    old_status = endpoint.status
    endpoint.status = status.upper()
    endpoint.last_seen = datetime.now(timezone.utc)
    if endpoint.status == "ONLINE":
        endpoint.risk_score = 12.0
    db.commit()

    audit_logger.log(
        db=db,
        action="ENDPOINT_STATE_MODIFIED",
        target=endpoint.hostname,
        reason=f"State transitioned from {old_status} to {endpoint.status}",
        risk_score=endpoint.risk_score,
        username="OPERATOR",
        result="SUCCESS"
    )

    return {"message": "Endpoint status updated", "endpoint_id": endpoint.id, "status": endpoint.status}
