"""
SentinelX AI — Policy Engine API Endpoints
Author: Yashpreet Singh (2026)
"""
from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import Policy
from app.schemas.schemas import PolicyResponse, PolicyUpdate
from app.services.audit_logger import audit_logger

router = APIRouter(prefix="/policies", tags=["Policy Engine"])

@router.get("", response_model=List[PolicyResponse])
def list_policies(db: Session = Depends(get_db)):
    return db.query(Policy).order_by(Policy.condition_risk_min.desc()).all()

@router.put("/{policy_id}", response_model=PolicyResponse)
def update_policy(
    policy_id: int,
    payload: PolicyUpdate,
    db: Session = Depends(get_db)
):
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    changes = []
    if payload.name is not None:
        policy.name = payload.name
        changes.append("name")
    if payload.condition_risk_min is not None:
        policy.condition_risk_min = payload.condition_risk_min
        changes.append(f"risk_min={payload.condition_risk_min}")
    if payload.condition_confidence_min is not None:
        policy.condition_confidence_min = payload.condition_confidence_min
        changes.append(f"conf_min={payload.condition_confidence_min}")
    if payload.action is not None:
        policy.action = payload.action.upper()
        changes.append(f"action={payload.action}")
    if payload.is_active is not None:
        policy.is_active = payload.is_active
        changes.append(f"active={payload.is_active}")
    if payload.description is not None:
        policy.description = payload.description

    policy.updated_at = datetime.now(timezone.utc)
    policy.updated_by = "Yashpreet Singh (Admin)"
    db.commit()
    db.refresh(policy)

    # Mandatory audit logging on policy changes
    audit_logger.log(
        db=db,
        action="POLICY_RULE_MODIFIED",
        target=f"Policy: {policy.name}",
        reason=f"Policy updated with parameters: {', '.join(changes)}",
        risk_score=policy.condition_risk_min,
        username="Yashpreet Singh",
        result="SUCCESS"
    )

    return policy
