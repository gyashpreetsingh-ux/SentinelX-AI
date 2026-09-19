"""
SentinelX AI — Behavioral Anomaly Detection Engine (Isolation Forest & Explainable AI)
Author: Yashpreet Singh (2026)
"""
import os
import pickle
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from sklearn.ensemble import IsolationForest

MODEL_DIR = os.path.join(os.path.dirname(__file__), "trained_models")
MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.pkl")

FEATURE_NAMES = [
    "login_hour",
    "session_duration",
    "files_accessed",
    "failed_logins",
    "new_device",
    "resource_access_rate",
    "typing_deviation",
    "mouse_deviation",
    "network_activity",
    "honeypot_interaction"
]

FEATURE_WEIGHTS = {
    "login_hour": 0.12,
    "session_duration": 0.08,
    "files_accessed": 0.20,
    "failed_logins": 0.15,
    "new_device": 0.10,
    "resource_access_rate": 0.12,
    "typing_deviation": 0.05,
    "mouse_deviation": 0.05,
    "network_activity": 0.08,
    "honeypot_interaction": 0.25
}

class AnomalyDetectionEngine:
    def __init__(self):
        os.makedirs(MODEL_DIR, exist_ok=True)
        self.model = self._load_or_train_model()

    def _generate_synthetic_baseline(self, n_samples: int = 1000) -> np.ndarray:
        """Generates realistic normal enterprise telemetry for training."""
        np.random.seed(42)
        # Normal baseline distribution:
        # login_hour: normal(9.0, 1.2) clamped between 6 and 20
        login_hour = np.clip(np.random.normal(9.0, 1.2, n_samples), 6.0, 20.0)
        # session_duration: normal(7.5, 1.0) clamped to > 0.5
        session_duration = np.clip(np.random.normal(7.5, 1.0, n_samples), 1.0, 12.0)
        # files_accessed: Poisson or normal(22.0, 6.0)
        files_accessed = np.clip(np.random.normal(22.0, 6.0, n_samples), 2, 60)
        # failed_logins: mostly 0, occasionally 1
        failed_logins = np.random.choice([0, 1], size=n_samples, p=[0.92, 0.08])
        # new_device: 98% existing device
        new_device = np.random.choice([0.0, 1.0], size=n_samples, p=[0.97, 0.03])
        # resource_access_rate: normal(1.2, 0.3)
        resource_access_rate = np.clip(np.random.normal(1.2, 0.3, n_samples), 0.2, 3.0)
        # typing_deviation: normal(0.12, 0.04)
        typing_deviation = np.clip(np.random.normal(0.12, 0.04, n_samples), 0.02, 0.30)
        # mouse_deviation: normal(0.14, 0.04)
        mouse_deviation = np.clip(np.random.normal(0.14, 0.04, n_samples), 0.02, 0.30)
        # network_activity in MB: normal(25.0, 10.0)
        network_activity = np.clip(np.random.normal(25.0, 10.0, n_samples), 2.0, 80.0)
        # honeypot_interaction: 0 in baseline
        honeypot_interaction = np.zeros(n_samples)

        matrix = np.column_stack([
            login_hour, session_duration, files_accessed, failed_logins,
            new_device, resource_access_rate, typing_deviation, mouse_deviation,
            network_activity, honeypot_interaction
        ])
        return matrix

    def _load_or_train_model(self) -> IsolationForest:
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, "rb") as f:
                    return pickle.load(f)
            except Exception:
                pass

        # Train new Isolation Forest on synthetic baseline
        X_train = self._generate_synthetic_baseline(1200)
        clf = IsolationForest(
            n_estimators=150,
            contamination=0.03,
            random_state=42,
            max_samples="auto"
        )
        clf.fit(X_train)
        try:
            with open(MODEL_PATH, "wb") as f:
                pickle.dump(clf, f)
        except Exception:
            pass
        return clf

    def analyze(self, data: Dict[str, Any], baseline: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Processes a session vector, scores anomaly with Isolation Forest,
        and computes explainable feature contributions.
        """
        if baseline is None:
            baseline = {
                "login_hour": 9.0,
                "session_duration": 7.5,
                "files_accessed": 22.0,
                "failed_logins": 0.1,
                "new_device": 0.0,
                "resource_access_rate": 1.2,
                "typing_deviation": 0.12,
                "mouse_deviation": 0.14,
                "network_activity": 25.0,
                "honeypot_interaction": 0.0
            }

        vector = [
            float(data.get("login_hour", 9.0)),
            float(data.get("session_duration", 7.0)),
            float(data.get("files_accessed", 20)),
            float(data.get("failed_logins", 0)),
            1.0 if data.get("new_device", False) else 0.0,
            float(data.get("resource_access_rate", 1.0)),
            float(data.get("typing_deviation", 0.1)),
            float(data.get("mouse_deviation", 0.1)),
            float(data.get("network_activity", 10.0)),
            1.0 if data.get("honeypot_interaction", False) else 0.0
        ]

        sample = np.array([vector])

        # Isolation forest raw anomaly score: typically in [-0.5, 0.5]
        # score_samples returns opposite of anomaly score (lower is more anomalous)
        raw_score = self.model.score_samples(sample)[0]
        # Normalize to 0 (normal) to 1 (highly anomalous)
        # Typical score_samples range: [-0.6, -0.3] -> map to [0, 1]
        normalized_anomaly = float(np.clip(( -raw_score - 0.35 ) / 0.35, 0.0, 1.0))

        # Calculate deviation contributions per feature
        deviations = {}
        feature_contributions = {}
        explanations = []

        total_weighted_deviation = 0.0

        for idx, feat in enumerate(FEATURE_NAMES):
            val = vector[idx]
            base_val = baseline.get(feat, 1.0)
            weight = FEATURE_WEIGHTS.get(feat, 0.1)

            if feat in ["new_device", "honeypot_interaction"]:
                dev = 100.0 if val > 0 else 0.0
            else:
                denom = max(abs(base_val), 1.0)
                # Percent delta
                dev = max(0.0, ((val - base_val) / denom) * 100.0)

            deviations[feat] = round(dev, 2)
            contrib = round(dev * weight, 2)
            feature_contributions[feat] = contrib
            total_weighted_deviation += contrib

            # Generate natural language explanation for significant deviations
            if feat == "login_hour" and abs(val - base_val) > 4.0:
                explanations.append(f"Off-hours access at {int(val):02d}:{int((val%1)*60):02d} (baseline: ~{int(base_val):02d}:00)")
            elif feat == "files_accessed" and val > 100:
                explanations.append(f"Unusual mass file access ({int(val)} files vs baseline {int(base_val)})")
            elif feat == "failed_logins" and val >= 3:
                explanations.append(f"Multiple consecutive failed authentications ({int(val)} failures)")
            elif feat == "new_device" and val > 0:
                explanations.append("Session originated from an unrecognized synthetic hardware profile")
            elif feat == "honeypot_interaction" and val > 0:
                explanations.append("Critical tripwire triggered in Digital Labyrinth decoy resource")
            elif feat == "typing_deviation" and val > 0.6:
                explanations.append(f"Keystroke dynamics deviation elevated ({val:.2f})")

        # Synthesize final risk and confidence
        is_anomaly = normalized_anomaly > 0.55 or data.get("honeypot_interaction", False) or data.get("files_accessed", 0) > 150
        
        # Risk score calculation
        risk_score = min(100.0, max(5.0, (normalized_anomaly * 60.0) + (total_weighted_deviation * 0.35)))
        if data.get("honeypot_interaction", False):
            risk_score = max(risk_score, 92.0)
        if data.get("files_accessed", 0) >= 300 and data.get("new_device", False):
            risk_score = max(risk_score, 88.0)

        # Confidence calculation
        # Higher when multiple independent features show deviation
        active_signals_count = sum(1 for v in deviations.values() if v > 20.0)
        confidence_score = min(99.0, max(50.0, 70.0 + (active_signals_count * 5.0)))
        if data.get("honeypot_interaction", False):
            confidence_score = max(confidence_score, 96.0)

        # Assign severity and recommended action
        if risk_score >= 80:
            severity = "CRITICAL"
            recommended_action = "QUARANTINE"
        elif risk_score >= 60:
            severity = "HIGH"
            recommended_action = "RESTRICT_SESSION"
        elif risk_score >= 30:
            severity = "MEDIUM"
            recommended_action = "STEP_UP_VERIFICATION"
        else:
            severity = "LOW"
            recommended_action = "ALLOW"

        if not explanations:
            explanation_text = "Session behavior is consistent with established normal baseline parameters."
        else:
            explanation_text = "Anomaly detected: " + "; ".join(explanations) + "."

        return {
            "anomaly_detected": is_anomaly,
            "anomaly_score": round(normalized_anomaly, 3),
            "risk_score": round(risk_score, 1),
            "confidence_score": round(confidence_score, 1),
            "severity": severity,
            "baseline": baseline,
            "current_session": data,
            "deviations": deviations,
            "feature_contributions": feature_contributions,
            "recommended_action": recommended_action,
            "explanation": explanation_text
        }

anomaly_engine = AnomalyDetectionEngine()
