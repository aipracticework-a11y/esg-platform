from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import lineage, explainability, quality, audit, supplier, reporting

app = FastAPI(
    title="ESG Trust Platform",
    description="Sustainability Data Trust, Governance & Assurance",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lineage.router, prefix="/api/lineage", tags=["Data Lineage"])
app.include_router(explainability.router, prefix="/api/explainability", tags=["AI Explainability"])
app.include_router(quality.router, prefix="/api/quality", tags=["Data Quality"])
app.include_router(audit.router, prefix="/api/audit", tags=["Audit Trail"])
app.include_router(supplier.router, prefix="/api/supplier", tags=["Supplier Portal"])
app.include_router(reporting.router, prefix="/api/reporting", tags=["Reporting Hub"])

@app.get("/")
def root():
    return {
        "app": "ESG Sustainability Trust Platform",
        "theme": "Data Trust, Governance & Assurance",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/api/dashboard/summary")
def dashboard_summary():
    return {
        "trust_score": 87,
        "data_quality_score": 92,
        "audit_readiness_score": 78,
        "ai_confidence_score": 84,
        "total_suppliers": 24,
        "active_anomalies": 3,
        "pending_approvals": 7,
        "last_updated": "2025-03-18T10:30:00Z",
        "recent_alerts": [
            {"id": 1, "type": "anomaly", "message": "Scope 2 electricity data spike detected", "severity": "high", "time": "2 hours ago"},
            {"id": 2, "type": "warning", "message": "Supplier B missing 3 required fields", "severity": "medium", "time": "5 hours ago"},
            {"id": 3, "type": "info", "message": "Q1 2025 audit trail export ready", "severity": "low", "time": "1 day ago"},
        ]
    }
