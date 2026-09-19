"""
SentinelX AI — Scam-Bait Phishing API Endpoints
Author: Yashpreet Singh (2026)
"""
from typing import List, Dict, Any
from fastapi import APIRouter
from app.schemas.schemas import PhishingAnalysisRequest, PhishingAnalysisResponse
from app.services.phishing_analyzer import phishing_analyzer

router = APIRouter(prefix="/phishing", tags=["Scam-Bait"])

SAMPLE_EMAILS = [
    {
        "id": "sample_1",
        "title": "High-Risk Urgent Credential Phish",
        "sender": "security-update@paypa1-security.com",
        "subject": "FINAL WARNING: Your Corporate Account Suspended in 24 Hours",
        "body": "URGENT ACTION REQUIRED: We detected unauthorized login activity from an unknown IP address. Your account will be permanently suspended within 24 hours unless you verify identity immediately. Please enter password and confirm one-time passcode at: https://paypa1-security.com/auth-verify to preserve your access."
    },
    {
        "id": "sample_2",
        "title": "Executive Impersonation (CEO Wire Transfer)",
        "sender": "ceo.corporate.alert@gmail.com",
        "subject": "Confidential: Urgent wire transfer required today",
        "body": "Hi, I am currently in a board meeting and cannot take calls. Please process an urgent wire transfer of $45,000 for vendor Q3 milestone payment immediately. Follow link to verify billing details: http://198.51.100.22/invoice-payment. Confirm once sent."
    },
    {
        "id": "sample_3",
        "title": "Suspicious Executable Macro Attachment",
        "sender": "billing-invoice-dep@cloud-share-secure.top",
        "subject": "Overdue Invoice #INV-9921 attached",
        "body": "Please review the attached invoice details. Payment is required immediately. Download invoice_update.vbs or execute payment_verification.exe to review charges."
    },
    {
        "id": "sample_4",
        "title": "Clean Operational Email (Baseline Safe)",
        "sender": "calendar-notifications@company.com",
        "subject": "Sprint Planning: Cyber Defense Platform 2026",
        "body": "Hi team, this is a reminder for our upcoming Sprint 4 planning session scheduled for tomorrow at 10:00 AM in Conference Room B. Please review the updated tickets in the internal tracker beforehand."
    }
]

@router.get("/samples")
def get_phishing_samples():
    return SAMPLE_EMAILS

@router.post("/analyze", response_model=PhishingAnalysisResponse)
def analyze_phishing_email(req: PhishingAnalysisRequest):
    return phishing_analyzer.analyze(
        sender=req.sender,
        subject=req.subject,
        body=req.body
    )
