"""
SentinelX AI — Incident Management API Endpoints
Author: Yashpreet Singh (2026)
"""
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from app.database.session import get_db
from app.models.entities import Incident, Endpoint, SecurityEvent, RecoveryJob
from app.schemas.schemas import IncidentResponse, IncidentStatusUpdate
from app.services.audit_logger import audit_logger

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=Dict[str, Any])
def list_incidents(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    endpoint_id: Optional[int] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = "created_at",
    sort_dir: str = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(Incident)

    if severity and severity != "ALL":
        query = query.filter(Incident.severity == severity.upper())
    if status and status != "ALL":
        query = query.filter(Incident.status == status.upper())
    if endpoint_id:
        query = query.filter(Incident.endpoint_id == endpoint_id)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Incident.title.ilike(search_pattern)) |
            (Incident.incident_code.ilike(search_pattern)) |
            (Incident.detection_method.ilike(search_pattern))
        )

    total = query.count()

    order_col = getattr(Incident, sort_by, Incident.created_at)
    if sort_dir.lower() == "asc":
        query = query.order_by(asc(order_col))
    else:
        query = query.order_by(desc(order_col))

    incidents = query.offset((page - 1) * page_size).limit(page_size).all()
    endpoints = {ep.id: ep.hostname for ep in db.query(Endpoint).all()}

    results = []
    for inc in incidents:
        results.append({
            "id": inc.id,
            "incident_code": inc.incident_code,
            "title": inc.title,
            "severity": inc.severity,
            "status": inc.status,
            "endpoint_id": inc.endpoint_id,
            "endpoint_hostname": endpoints.get(inc.endpoint_id, "N/A"),
            "detection_method": inc.detection_method,
            "risk_score": inc.risk_score,
            "confidence_score": inc.confidence_score,
            "evidence_json": inc.evidence_json or [],
            "recommended_action": inc.recommended_action,
            "action_taken": inc.action_taken,
            "recovery_status": inc.recovery_status,
            "created_at": inc.created_at,
            "updated_at": inc.updated_at
        })

    return {
        "items": results,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

@router.get("/{incident_id}")
def get_incident_detail(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    endpoint = db.query(Endpoint).filter(Endpoint.id == incident.endpoint_id).first() if incident.endpoint_id else None
    
    # Correlated security events
    related_events = []
    if incident.endpoint_id:
        events = db.query(SecurityEvent).filter(
            SecurityEvent.endpoint_id == incident.endpoint_id
        ).order_by(SecurityEvent.timestamp.desc()).limit(10).all()
        related_events = [
            {
                "id": ev.id,
                "timestamp": ev.timestamp,
                "event_type": ev.event_type,
                "source": ev.source,
                "target": ev.target,
                "severity": ev.severity,
                "risk_impact": ev.risk_impact
            }
            for ev in events
        ]

    # Recovery jobs
    recovery_jobs = db.query(RecoveryJob).filter(RecoveryJob.incident_id == incident.id).all()

    return {
        "incident": {
            "id": incident.id,
            "incident_code": incident.incident_code,
            "title": incident.title,
            "severity": incident.severity,
            "status": incident.status,
            "endpoint_id": incident.endpoint_id,
            "endpoint_hostname": endpoint.hostname if endpoint else "N/A",
            "synthetic_ip": endpoint.synthetic_ip if endpoint else "N/A",
            "endpoint_status": endpoint.status if endpoint else "N/A",
            "detection_method": incident.detection_method,
            "risk_score": incident.risk_score,
            "confidence_score": incident.confidence_score,
            "evidence_json": incident.evidence_json or [],
            "recommended_action": incident.recommended_action,
            "action_taken": incident.action_taken,
            "recovery_status": incident.recovery_status,
            "created_at": incident.created_at,
            "updated_at": incident.updated_at
        },
        "related_events": related_events,
        "recovery_jobs": [
            {
                "id": job.id,
                "snapshot_id": job.snapshot_id,
                "status": job.status,
                "progress_percent": job.progress_percent,
                "logs": job.logs_json,
                "started_at": job.started_at,
                "completed_at": job.completed_at
            }
            for job in recovery_jobs
        ]
    }

@router.patch("/{incident_id}/status")
def update_incident_status(
    incident_id: int,
    payload: IncidentStatusUpdate,
    db: Session = Depends(get_db)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    old_status = incident.status
    incident.status = payload.status.upper()
    if payload.action_taken:
        incident.action_taken = payload.action_taken
    incident.updated_at = datetime.now(timezone.utc)
    db.commit()

    audit_logger.log(
        db=db,
        action="INCIDENT_STATUS_UPDATE",
        target=incident.incident_code,
        reason=f"Status modified from {old_status} to {incident.status}",
        risk_score=incident.risk_score,
        username="OPERATOR",
        result="SUCCESS"
    )

    return {"message": "Incident updated successfully", "incident_id": incident.id, "status": incident.status}
