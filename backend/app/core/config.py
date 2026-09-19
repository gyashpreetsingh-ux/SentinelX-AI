"""
SentinelX AI — System Configuration
Author: Yashpreet Singh (2026)
"""
import os
from typing import List

class Settings:
    PROJECT_NAME: str = "SentinelX AI"
    PROJECT_FULL_NAME: str = "Next-Gen Autonomous Cyber Defense Platform"
    TAGLINE: str = "Detect. Understand. Contain. Recover. Learn."
    AUTHOR: str = "Yashpreet Singh"
    YEAR: int = 2026
    VERSION: str = "1.0.0"
    
    # Server
    PORT: int = int(os.getenv("PORT", 8088))
    HOST: str = os.getenv("HOST", "0.0.0.0")

    # Security & Auth
    SECRET_KEY: str = os.getenv("JWT_SECRET", "sentinelx-cyber-defense-jwt-secret-key-2026-yashpreet")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sentinelx.db")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip() for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5188,http://localhost:3100,http://127.0.0.1:5188,http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
        ).split(",")
    ]
    
    # Thresholds
    RISK_THRESHOLD_CRITICAL: int = 80
    RISK_THRESHOLD_HIGH: int = 60
    RISK_THRESHOLD_MEDIUM: int = 30
    AUTO_CONTAINMENT_ENABLED: bool = True

settings = Settings()
