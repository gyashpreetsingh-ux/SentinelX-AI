"""
SentinelX AI — Response & Containment API Endpoints
Author: Yashpreet Singh (2026)
"""
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.self_heal import self_heal_engine
from app.schemas.schemas import EndpointResponse

router = APIRouter(prefix="/response", tags=["Self-Heal Containment"])

@router.post("/quarantine")
def quarantine_endpoint(
    endpoint_id: int,
    reason: Optional[str] = "Manual quarantine commanded by SOC operator",
    db: Session = Depends(get_db)
):
    result = self_heal_engine.quarantine_endpoint(
        db=db,
        endpoint_id=endpoint_id,
        reason=reason,
        actor="SOC_OPERATOR"
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.post("/restrict")
def restrict_session(
    endpoint_id: int,
    reason: Optional[str] = "Step-up verification enforced by operator",
    db: Session = Depends(get_db)
):
    result = self_heal_engine.restrict_session(
        db=db,
        endpoint_id=endpoint_id,
        reason=reason,
        actor="SOC_OPERATOR"
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result
