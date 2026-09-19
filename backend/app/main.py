"""
SentinelX AI — Next-Gen Autonomous Cyber Defense Platform
Main FastAPI Application Entrypoint
Author: Yashpreet Singh (2026)
Tagline: Detect. Understand. Contain. Recover. Learn.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.seed import init_db
from app.core.websocket_hub import ws_manager
from app.api import (
    auth, dashboard, behavior, risk, incidents,
    endpoints, honeypots, response, recovery,
    phishing, threat_intel, policies, audit, simulation
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database & Seed Realistic Synthetic Data
    init_db()
    yield
    # Shutdown

app = FastAPI(
    title=f"{settings.PROJECT_NAME} — {settings.PROJECT_FULL_NAME}",
    description=(
        "Next-Gen Autonomous Cyber Defense Platform engineered by Yashpreet Singh (2026). "
        "Provides privacy-first behavioral anomaly detection, honeypot decoy simulation, "
        "automated self-heal containment, trusted snapshot rollback, and explainable AI scoring."
    ),
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(behavior.router, prefix="/api")
app.include_router(risk.router, prefix="/api")
app.include_router(incidents.router, prefix="/api")
app.include_router(endpoints.router, prefix="/api")
app.include_router(honeypots.router, prefix="/api")
app.include_router(response.router, prefix="/api")
app.include_router(recovery.router, prefix="/api")
app.include_router(phishing.router, prefix="/api")
app.include_router(threat_intel.router, prefix="/api")
app.include_router(policies.router, prefix="/api")
app.include_router(audit.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Echo or receive keepalive heartbeats
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "name": settings.PROJECT_FULL_NAME,
        "tagline": settings.TAGLINE,
        "author": settings.AUTHOR,
        "year": settings.YEAR,
        "status": "OPERATIONAL",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "engines": {
            "detection_engine": "ONLINE",
            "risk_engine": "ONLINE",
            "policy_engine": "ONLINE",
            "response_engine": "ONLINE",
            "recovery_engine": "ONLINE"
        },
        "author": settings.AUTHOR,
        "year": settings.YEAR
    }
