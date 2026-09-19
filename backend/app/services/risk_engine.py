"""
SentinelX AI — Risk & Confidence Scoring Engine
Author: Yashpreet Singh (2026)
"""
from typing import Dict, Any, List, Tuple
from app.schemas.schemas import RiskSignalInput, RiskCalculationResponse

WEIGHTS = {
    "behavior_anomaly": 0.20,
    "auth_anomaly": 0.15,
    "endpoint_anomaly": 0.20,
    "network_anomaly": 0.15,
    "honeypot_interaction": 0.25,
    "threat_intel_match": 0.05
}

class RiskEngine:
    @staticmethod
    def calculate(signals: RiskSignalInput) -> RiskCalculationResponse:
        signal_dict = {
            "behavior_anomaly": signals.behavior_anomaly,
            "auth_anomaly": signals.auth_anomaly,
            "endpoint_anomaly": signals.endpoint_anomaly,
            "network_anomaly": signals.network_anomaly,
            "honeypot_interaction": signals.honeypot_interaction,
            "threat_intel_match": signals.threat_intel_match
        }

        contributions = {}
        weighted_sum = 0.0
        active_signals = 0
        evidence_list = []

        for key, weight in WEIGHTS.items():
            val = signal_dict.get(key, 0.0)
            contrib = val * weight
            contributions[key] = round(contrib, 2)
            weighted_sum += contrib

            if val > 30.0:
                active_signals += 1
                if key == "behavior_anomaly":
                    evidence_list.append(f"Behavior deviation score {val:.0f}/100 (abnormal activity envelope)")
                elif key == "auth_anomaly":
                    evidence_list.append(f"Authentication failure/credential abuse anomaly ({val:.0f}/100)")
                elif key == "endpoint_anomaly":
                    evidence_list.append(f"Suspicious synthetic process execution anomaly ({val:.0f}/100)")
                elif key == "network_anomaly":
                    evidence_list.append(f"Anomalous lateral connection/data transmission pattern ({val:.0f}/100)")
                elif key == "honeypot_interaction":
                    evidence_list.append(f"Direct intrusion tripwire hit on Digital Labyrinth decoy ({val:.0f}/100)")
                elif key == "threat_intel_match":
                    evidence_list.append(f"Matching indicator in SentinelX threat intelligence feeds ({val:.0f}/100)")

        # Honeypot interaction directly amplifies severity due to deterministic trap nature
        if signals.honeypot_interaction > 50.0:
            weighted_sum = max(weighted_sum, 88.0 + (signals.honeypot_interaction - 50.0) * 0.15)

        raw_risk = min(100.0, max(0.0, weighted_sum))
        risk_score = round(raw_risk, 1)

        # Confidence Calculation
        # More correlated independent signals = dramatically higher confidence
        base_confidence = 65.0
        if active_signals == 0:
            confidence_score = 40.0
        elif active_signals == 1:
            confidence_score = 72.0
        elif active_signals == 2:
            confidence_score = 84.0
        elif active_signals == 3:
            confidence_score = 92.0
        else:
            confidence_score = min(99.0, 94.0 + (active_signals * 1.5))

        if signals.honeypot_interaction > 70.0:
            confidence_score = max(confidence_score, 96.0)

        # Severity Classification
        if risk_score >= 80.0:
            severity = "CRITICAL"
            recommended_action = "QUARANTINE"
        elif risk_score >= 60.0:
            severity = "HIGH"
            recommended_action = "RESTRICT_SESSION"
        elif risk_score >= 30.0:
            severity = "MEDIUM"
            recommended_action = "STEP_UP_VERIFICATION"
        else:
            severity = "LOW"
            recommended_action = "ALLOW"

        # Construct explainability summary
        if not evidence_list:
            explanation = "Risk evaluated as LOW. All telemetry signals remain within baseline security thresholds."
        else:
            evidence_summary = "; ".join(evidence_list)
            explanation = (
                f"Elevated risk score ({risk_score}/100) with {confidence_score:.0f}% confidence determined by "
                f"{active_signals} correlated signal vector(s): {evidence_summary}. "
                f"Policy recommended action: {recommended_action}."
            )

        return RiskCalculationResponse(
            risk_score=risk_score,
            confidence_score=round(confidence_score, 1),
            severity=severity,
            recommended_action=recommended_action,
            signal_contributions=contributions,
            weights_applied=WEIGHTS,
            evidence_list=evidence_list,
            explanation=explanation
        )

risk_engine = RiskEngine()
