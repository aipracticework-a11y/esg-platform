from fastapi import APIRouter, UploadFile, File
from services.gemini_service import get_gemini_response

router = APIRouter()

SUPPLIERS = [
    {"id": 1, "name": "Supplier A (GreenTech Manufacturing)", "contact": "esg@greentech.com", "status": "approved", "quality_score": 96, "last_submission": "2025-03-15", "scope": "Scope 1 & 3", "country": "Germany", "certification": "ISO 14001", "progress": 100},
    {"id": 2, "name": "Supplier B (FastLog Logistics)", "contact": "sustainability@fastlog.com", "status": "needs_review", "quality_score": 74, "last_submission": "2025-03-17", "scope": "Scope 3", "country": "India", "certification": "None", "progress": 65},
    {"id": 3, "name": "PackRight Packaging Co.", "contact": "esg@packright.com", "status": "approved", "quality_score": 91, "last_submission": "2025-03-12", "scope": "Scope 3", "country": "UK", "certification": "FSC, ISO 14001", "progress": 100},
    {"id": 4, "name": "Supplier C (PowerGrid Utilities)", "contact": "data@powergrid.com", "status": "rejected", "quality_score": 45, "last_submission": "2025-03-13", "scope": "Scope 2", "country": "USA", "certification": "None", "progress": 30},
    {"id": 5, "name": "Supplier D (AgroFarm Inputs)", "contact": "esg@agrofarm.com", "status": "pending", "quality_score": 0, "last_submission": None, "scope": "Scope 3", "country": "Brazil", "certification": "Rainforest Alliance", "progress": 10},
    {"id": 6, "name": "Supplier E (TechParts Co)", "contact": "compliance@techparts.com", "status": "approved", "quality_score": 88, "last_submission": "2025-03-10", "scope": "Scope 3", "country": "Taiwan", "certification": "ISO 14001, SA8000", "progress": 100},
]

STATUS_COLORS = {"approved": "green", "needs_review": "amber", "rejected": "red", "pending": "gray"}

@router.get("/list")
def get_suppliers():
    suppliers_with_colors = [{**s, "status_color": STATUS_COLORS.get(s["status"], "gray")} for s in SUPPLIERS]
    return {
        "suppliers": suppliers_with_colors,
        "summary": {
            "total": len(SUPPLIERS),
            "approved": sum(1 for s in SUPPLIERS if s["status"] == "approved"),
            "pending_review": sum(1 for s in SUPPLIERS if s["status"] in ["pending", "needs_review"]),
            "rejected": sum(1 for s in SUPPLIERS if s["status"] == "rejected"),
        }
    }

@router.get("/{supplier_id}")
def get_supplier(supplier_id: int):
    supplier = next((s for s in SUPPLIERS if s["id"] == supplier_id), None)
    if not supplier:
        return {"error": "Supplier not found"}
    return supplier

@router.post("/upload")
async def upload_supplier_data(file: UploadFile = File(...), supplier_id: int = 1):
    content = await file.read()
    file_size = len(content)
    prompt = f"A supplier uploaded an ESG data file named '{file.filename}' ({file_size} bytes). Simulate a data quality check result with 2-3 specific findings."
    analysis = get_gemini_response(prompt)
    return {
        "filename": file.filename,
        "file_size": file_size,
        "supplier_id": supplier_id,
        "status": "processed",
        "ai_analysis": analysis,
        "validation_results": {
            "records_detected": 150,
            "records_valid": 138,
            "records_flagged": 12,
            "completeness": "92%"
        }
    }

@router.get("/{supplier_id}/risk-analysis")
def get_supplier_risk(supplier_id: int):
    supplier = next((s for s in SUPPLIERS if s["id"] == supplier_id), None)
    if not supplier:
        return {"error": "Supplier not found"}
    prompt = f"Analyze ESG risk for supplier '{supplier['name']}' with quality score {supplier['quality_score']}/100, certification: {supplier['certification']}, country: {supplier['country']}. Give risk assessment in 3 bullet points."
    risk_analysis = get_gemini_response(prompt)
    return {"supplier": supplier, "risk_analysis": risk_analysis, "overall_risk": "medium" if supplier["quality_score"] < 80 else "low"}
