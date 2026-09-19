"""
SentinelX AI — Policy Evaluation Engine
Author: Yashpreet Singh (2026)
"""
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from app.models.entities import Policy

class PolicyEngine:
    @staticmethod
    def evaluate(db: Session, risk_score: float, confidence_score: float) -> Tuple[Optional[Policy], str, str]:
        """
        Evaluates active policies sorted by strictness (highest risk threshold first).
        Returns: (matched_policy, action_to_take, evaluation_reason)
        """
        policies = (
            db.query(Policy)
            .filter(Policy.is_active == True)
            .order_by(Policy.condition_risk_min.desc(), Policy.condition_confidence_min.desc())
            .all()
        )

        for pol in policies:
            if risk_score >= pol.condition_risk_min and confidence_score >= pol.condition_confidence_min:
                reason = (
                    f"Policy '{pol.name}' triggered: Risk ({risk_score:.1f} >= {pol.condition_risk_min}) "
                    f"and Confidence ({confidence_score:.1f}% >= {pol.condition_confidence_min}%). "
                    f"Enforcing action: {pol.action}."
                )
                return pol, pol.action, reason

        # Fallback default evaluation
        if risk_score >= 85.0 and confidence_score >= 90.0:
            return None, "QUARANTINE", "Critical emergency rule fallback: quarantine initiated."
        elif risk_score >= 60.0:
            return None, "RESTRICT_SESSION", "High risk threshold fallback: restrict session."
        elif risk_score >= 30.0:
            return None, "STEP_UP", "Medium risk threshold fallback: step-up verification."
        else:
            return None, "ALLOW", "Risk within acceptable limits: traffic allowed."

policy_engine = PolicyEngine()
