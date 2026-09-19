"""
SentinelX AI — Scam-Bait Phishing Analysis Engine
Author: Yashpreet Singh (2026)
"""
import re
import hashlib
from typing import Dict, Any, List
from app.schemas.schemas import PhishingAnalysisResponse

URGENCY_KEYWORDS = [
    "urgent", "immediately", "within 24 hours", "account suspended",
    "unauthorized transaction", "final warning", "action required",
    "suspended permanently", "security alert", "terminate access"
]

CREDENTIAL_KEYWORDS = [
    "enter password", "verify password", "provide your credentials",
    "update billing", "one-time passcode", "verify identity",
    "login to restore", "confirm account details", "ssn", "seed phrase"
]

SUSPICIOUS_DOMAINS = [
    "paypa1-security.com", "login-micro-soft.com", "secure-bank-auth.net",
    "verify-apple-id.info", "account-alert-update.xyz", "bit.ly", "tinyurl.com",
    "cloud-share-secure.top"
]

SUSPICIOUS_EXTENSIONS = [".exe", ".scr", ".vbs", ".js", ".iso", ".bat", ".ps1"]

class PhishingAnalyzer:
    @staticmethod
    def analyze(sender: str, subject: str, body: str) -> PhishingAnalysisResponse:
        content_lower = f"{sender} {subject} {body}".lower()
        indicators = []
        reasons = []
        score = 5.0  # Baseline low risk

        # 1. Check Urgency
        urgency_matches = [kw for kw in URGENCY_KEYWORDS if kw in content_lower]
        if urgency_matches:
            score += min(35.0, len(urgency_matches) * 12.0)
            indicators.append("Urgency & Coercion Markers")
            reasons.append(f"High-urgency psychological coercion detected: '{', '.join(urgency_matches[:3])}'")

        # 2. Check Credential Requests
        cred_matches = [kw for kw in CREDENTIAL_KEYWORDS if kw in content_lower]
        if cred_matches:
            score += min(40.0, len(cred_matches) * 15.0)
            indicators.append("Credential Harvesting Lure")
            reasons.append(f"Explicit credential solicitation: '{', '.join(cred_matches[:2])}'")

        # 3. Check Suspicious URLs & IP links
        urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', body)
        for url in urls:
            url_lower = url.lower()
            if any(dom in url_lower for dom in SUSPICIOUS_DOMAINS):
                score += 30.0
                indicators.append("Known Malicious/Decoy Domain Pattern")
                reasons.append(f"Contains synthetic phishing destination: {url}")
            if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url):
                score += 35.0
                indicators.append("Direct IP URL Structure")
                reasons.append(f"Direct raw IP web link detected without validated domain: {url}")

        # 4. Check Sender Domain Anomaly
        if "@" in sender:
            s_domain = sender.split("@")[-1].lower()
            if any(susp in s_domain for susp in ["xyz", "top", "info", "click", "buzz"]):
                score += 20.0
                indicators.append("High-Risk TLD in Sender Address")
                reasons.append(f"Sender domain uses anomalous high-risk TLD: {s_domain}")
            if any(vip in content_lower for vip in ["ceo", "cfo", "executive", "payroll"]) and ("gmail.com" in s_domain or "yahoo.com" in s_domain):
                score += 25.0
                indicators.append("Executive Impersonation / Freemail Mismatch")
                reasons.append(f"Executive identity claimed from public freemail provider: {sender}")

        # 5. Check Attachments mentioned
        for ext in SUSPICIOUS_EXTENSIONS:
            if ext in content_lower:
                score += 30.0
                indicators.append("Dangerous Executable Attachment Indicator")
                reasons.append(f"Executable script or container format referenced: '{ext}'")

        # Clamp score
        risk_score = min(100.0, max(5.0, score))

        # Classification
        if risk_score >= 70.0:
            classification = "HIGH_RISK"
            recommended_action = "QUARANTINE"
        elif risk_score >= 35.0:
            classification = "SUSPICIOUS"
            recommended_action = "ANALYZE"
        else:
            classification = "SAFE"
            recommended_action = "ALLOW"

        # Confidence
        confidence = min(98.0, max(55.0, 60.0 + (len(indicators) * 10.0)))
        if not reasons:
            reasons.append("Clean synthetic message profile. No credential lures, urgency coercion, or deceptive URLs detected.")

        # Threat signature
        sig_hash = hashlib.sha256(f"{sender}-{subject}".encode()).hexdigest()[:8].upper()
        synthetic_sig = f"PHISH-SYNTH-2026-{sig_hash}"

        return PhishingAnalysisResponse(
            classification=classification,
            risk_score=round(risk_score, 1),
            confidence_score=round(confidence, 1),
            indicators_found=indicators,
            reasons=reasons,
            recommended_action=recommended_action,
            synthetic_threat_signature=synthetic_sig
        )

phishing_analyzer = PhishingAnalyzer()
