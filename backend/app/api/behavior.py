"""
SentinelX AI — Ghost Pattern Behavioral Anomaly Detection API
Author: Yashpreet Singh (2026)
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import BehaviorProfile, Endpoint, SecurityEvent
from app.schemas.schemas import BehaviorAnalysisRequest, BehaviorAnalysisResponse
from app.ml.anomaly_detector import anomaly_engine

router = APIRouter(prefix="/behavior", tags=["Ghost Pattern"])

@router.get("/profiles")
def get_behavior_profiles(db: Session = Depends(get_db)):
    profiles = db.query(BehaviorProfile).all()
    endpoints = {ep.id: ep.hostname for ep in db.query(Endpoint).all()}
    return [
        {
            "id": p.id,
            "endpoint_id": p.endpoint_id,
            "hostname": endpoints.get(p.endpoint_id, f"Endpoint-{p.endpoint_id:02d}"),
            "user_identifier": p.user_identifier,
            "baseline_login_hour": p.baseline_login_hour,
            "session_duration_mean": p.session_duration_mean,
            "files_accessed_mean": p.files_accessed_mean,
            "failed_logins_mean": p.failed_logins_mean,
            "typing_variance": p.typing_variance,
            "mouse_variance": p.mouse_variance,
            "sample_count": p.sample_count,
            "updated_at": p.updated_at
        }
        for p in profiles
    ]

@router.post("/analyze", response_model=BehaviorAnalysisResponse)
def analyze_behavior(req: BehaviorAnalysisRequest, db: Session = Depends(get_db)):
    # Retrieve baseline profile if endpoint_id provided
    baseline_profile = None
    if req.endpoint_id:
        p = db.query(BehaviorProfile).filter(BehaviorProfile.endpoint_id == req.endpoint_id).first()
        if p:
            baseline_profile = {
                "login_hour": p.baseline_login_hour,
                "session_duration": p.session_duration_mean,
                "files_accessed": p.files_accessed_mean,
                "failed_logins": p.failed_logins_mean,
                "new_device": 0.0,
                "resource_access_rate": 1.2,
                "typing_deviation": p.typing_variance,
                "mouse_deviation": p.mouse_variance,
                "network_activity": 25.0,
                "honeypot_interaction": 0.0
            }

    data = req.model_dump()
    result = anomaly_engine.analyze(data, baseline=baseline_profile)
    return result
