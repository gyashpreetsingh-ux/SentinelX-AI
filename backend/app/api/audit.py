"""
SentinelX AI — Audit Trail API Endpoints
Author: Yashpreet Singh (2026)
"""
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import AuditLog
from app.schemas.schemas import AuditLogResponse

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

@router.get("", response_model=Dict[str, Any])
def list_audit_logs(
    search: Optional[str] = None,
    action: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    if action and action != "ALL":
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))
    if search:
        s = f"%{search}%"
        query = query.filter(
            (AuditLog.target.ilike(s)) |
            (AuditLog.reason.ilike(s)) |
            (AuditLog.username.ilike(s)) |
            (AuditLog.action.ilike(s))
        )

    total = query.count()
    logs = query.order_by(AuditLog.timestamp.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": [
            {
                "id": l.id,
                "timestamp": l.timestamp,
                "username": l.username,
                "action": l.action,
                "target": l.target,
                "reason": l.reason,
                "risk_score": l.risk_score,
                "result": l.result
            }
            for l in logs
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }
