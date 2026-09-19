"""
SentinelX AI — Append-Only Audit Logging Service
Author: Yashpreet Singh (2026)
"""
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.entities import AuditLog

class AuditLogger:
    @staticmethod
    def log(
        db: Session,
        action: str,
        target: str,
        reason: str,
        risk_score: float = 0.0,
        username: str = "SYSTEM_AUTONOMOUS",
        result: str = "SUCCESS"
    ) -> AuditLog:
        """Appends an immutable audit log record to the database."""
        entry = AuditLog(
            timestamp=datetime.now(timezone.utc),
            username=username,
            action=action,
            target=target,
            reason=reason,
            risk_score=round(risk_score, 1),
            result=result
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

audit_logger = AuditLogger()
