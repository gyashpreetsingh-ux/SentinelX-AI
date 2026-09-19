"""
SentinelX AI — Threat Intelligence API Endpoints (Predictive Hunt)
Author: Yashpreet Singh (2026)
"""
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import ThreatIndicator
from app.schemas.schemas import ThreatIndicatorResponse
from app.services.audit_logger import audit_logger

router = APIRouter(prefix="/threat-intelligence", tags=["Predictive Hunt"])

@router.get("", response_model=List[ThreatIndicatorResponse])
def list_threat_indicators(
    category: Optional[str] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ThreatIndicator)
    if category and category != "ALL":
        query = query.filter(ThreatIndicator.category == category)
    if severity and severity != "ALL":
        query = query.filter(ThreatIndicator.severity == severity.upper())
    if search:
        query = query.filter(ThreatIndicator.indicator.ilike(f"%{search}%"))

    return query.order_by(ThreatIndicator.last_seen.desc()).all()

@router.post("", response_model=ThreatIndicatorResponse)
def add_threat_indicator(
    indicator: str,
    category: str,
    severity: str = "HIGH",
    confidence: float = 90.0,
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    ti = ThreatIndicator(
        indicator=indicator,
        category=category,
        severity=severity.upper(),
        confidence=confidence,
        first_seen=now,
        last_seen=now,
        status="ACTIVE",
        source="SentinelX Threat Hunter Feed"
    )
    db.add(ti)
    db.commit()
    db.refresh(ti)

    audit_logger.log(
        db=db,
        action="THREAT_INDICATOR_ADDED",
        target=ti.indicator,
        reason=f"Added synthetic threat indicator {ti.indicator} [{ti.category}]",
        risk_score=75.0,
        username="OPERATOR",
        result="SUCCESS"
    )

    return ti
