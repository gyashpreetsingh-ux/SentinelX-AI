"""
SentinelX AI — Recovery Engine API Endpoints
Author: Yashpreet Singh (2026)
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import RecoveryJob, Endpoint
from app.schemas.schemas import RecoveryStartRequest, RecoveryJobResponse
from app.services.recovery_engine import recovery_engine

router = APIRouter(prefix="/recovery", tags=["Recovery Engine"])

@router.get("/jobs", response_model=List[RecoveryJobResponse])
def list_recovery_jobs(limit: int = 15, db: Session = Depends(get_db)):
    return db.query(RecoveryJob).order_by(RecoveryJob.started_at.desc()).limit(limit).all()

@router.post("/start")
def start_recovery_job(req: RecoveryStartRequest, db: Session = Depends(get_db)):
    result = recovery_engine.start_recovery(
        db=db,
        endpoint_id=req.endpoint_id,
        incident_id=req.incident_id,
        snapshot_id=req.snapshot_id or "Snapshot-2026-09-18-0900",
        actor="SOC_OPERATOR"
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.get("/{job_id}")
def get_recovery_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(RecoveryJob).filter(RecoveryJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Recovery job not found")
    endpoint = db.query(Endpoint).filter(Endpoint.id == job.endpoint_id).first()
    return {
        "id": job.id,
        "endpoint_id": job.endpoint_id,
        "hostname": endpoint.hostname if endpoint else "Unknown",
        "snapshot_id": job.snapshot_id,
        "status": job.status,
        "progress_percent": job.progress_percent,
        "logs": job.logs_json,
        "started_at": job.started_at,
        "completed_at": job.completed_at
    }
