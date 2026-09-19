"""
SentinelX AI — Self-Heal Containment Engine
Author: Yashpreet Singh (2026)
"""
import hashlib
import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.entities import Endpoint, Incident
from app.services.audit_logger import audit_logger

class SelfHealEngine:
    @staticmethod
    def quarantine_endpoint(
        db: Session,
        endpoint_id: int,
        reason: str = "High-confidence critical threat threshold exceeded",
        actor: str = "POLICY_ENGINE_AUTONOMOUS"
    ) -> Dict[str, Any]:
        endpoint = db.query(Endpoint).filter(Endpoint.id == endpoint_id).first()
        if not endpoint:
            return {"success": False, "error": f"Endpoint {endpoint_id} not found"}

        now = datetime.now(timezone.utc)
        # Compute synthetic digital evidence digest
        evidence_digest = hashlib.sha256(
            f"{endpoint.hostname}-{now.isoformat()}-evidence-bundle".encode("utf-8")
        ).hexdigest()

        isolation_details = {
            "quarantined_at": now.isoformat(),
            "synthetic_ip_severed": endpoint.synthetic_ip,
            "simulated_network_interface": "eth0_isolated",
            "evidence_preservation_hash": f"SHA256-{evidence_digest[:24]}",
            "active_sockets_terminated": 4,
            "isolated_processes": [p.get("pid") for p in (endpoint.processes_json or []) if "suspicious" in str(p).lower()]
        }

        previous_status = endpoint.status
        endpoint.status = "QUARANTINED"
        endpoint.isolation_details = isolation_details
        endpoint.last_seen = now
        db.commit()
        db.refresh(endpoint)

        # Audit log entry
        audit_logger.log(
            db=db,
            action="ENDPOINT_QUARANTINED",
            target=endpoint.hostname,
            reason=reason,
            risk_score=endpoint.risk_score,
            username=actor,
            result="SUCCESS"
        )

        return {
            "success": True,
            "endpoint_id": endpoint.id,
            "hostname": endpoint.hostname,
            "previous_status": previous_status,
            "current_status": endpoint.status,
            "isolation_details": isolation_details
        }

    @staticmethod
    def restrict_session(
        db: Session,
        endpoint_id: int,
        reason: str = "Behavioral deviation detected; step-up verification required",
        actor: str = "POLICY_ENGINE"
    ) -> Dict[str, Any]:
        endpoint = db.query(Endpoint).filter(Endpoint.id == endpoint_id).first()
        if not endpoint:
            return {"success": False, "error": f"Endpoint {endpoint_id} not found"}

        endpoint.status = "SUSPICIOUS"
        db.commit()
        db.refresh(endpoint)

        audit_logger.log(
            db=db,
            action="SESSION_RESTRICTED",
            target=endpoint.hostname,
            reason=reason,
            risk_score=endpoint.risk_score,
            username=actor,
            result="SUCCESS"
        )

        return {
            "success": True,
            "endpoint_id": endpoint.id,
            "hostname": endpoint.hostname,
            "current_status": endpoint.status,
            "action_taken": "STEP_UP_VERIFICATION_ISSUED"
        }

self_heal_engine = SelfHealEngine()
