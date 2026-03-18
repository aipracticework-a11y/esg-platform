import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def get_gemini_response(prompt: str) -> str:
    """Call Gemini API if key is set, otherwise return smart mock response."""
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return _mock_response(prompt)
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI service error: {str(e)}. Using mock response: {_mock_response(prompt)}"

def _mock_response(prompt: str) -> str:
    prompt_lower = prompt.lower()
    if "anomaly" in prompt_lower or "spike" in prompt_lower:
        return (
            "The anomaly detected in Scope 2 electricity data is likely caused by a "
            "seasonal surge in cooling requirements during Q3, combined with a new "
            "manufacturing facility coming online. The 34% spike exceeds the expected "
            "15% seasonal variance threshold. Recommended action: verify with facility "
            "managers and update baseline assumptions for Q4 projections."
        )
    elif "supplier" in prompt_lower or "risk" in prompt_lower:
        return (
            "Supplier risk score of 72/100 is driven primarily by three factors: "
            "1) Incomplete Scope 3 emissions disclosures (40% weight), "
            "2) No third-party audit certification in past 24 months (35% weight), "
            "3) Geographic concentration risk in high-emission regions (25% weight). "
            "Confidence level: 84%. Recommend requesting updated ESG disclosure by Q2 2025."
        )
    elif "lineage" in prompt_lower or "provenance" in prompt_lower:
        return (
            "Data provenance verified across 5 transformation steps. Original source: "
            "Supplier ERP system (SAP S/4HANA) ingested via API on 2025-01-15. "
            "Data passed through: unit conversion, quality validation, scope classification, "
            "and aggregation pipeline. No data gaps detected. Audit hash matches original submission."
        )
    elif "assurance" in prompt_lower or "report" in prompt_lower:
        return (
            "Assurance readiness score: 78/100. Key gaps identified: "
            "2 suppliers pending sign-off, Scope 3 Category 11 calculations require "
            "methodology documentation, and AI model explainability reports need timestamping. "
            "Estimated time to full CSRD readiness: 2-3 weeks with current progress rate."
        )
    else:
        return (
            "ESG data analysis complete. The sustainability metrics show strong governance "
            "controls with an overall trust score of 87%. Data lineage is fully traceable "
            "across all Scope 1, 2, and 3 categories. Recommend quarterly review of "
            "supplier data quality thresholds to maintain assurance standards."
        )

def explain_model_decision(metric_name: str, value: float, factors: list) -> str:
    prompt = f"""
    You are an ESG AI explainability assistant. Explain why the AI gave the following result:
    Metric: {metric_name}
    Value: {value}
    Contributing factors: {', '.join(factors)}
    Give a clear, concise explanation in 3-4 sentences that an auditor would understand.
    """
    return get_gemini_response(prompt)

def analyze_anomaly(data_source: str, anomaly_description: str) -> str:
    prompt = f"""
    You are an ESG data quality expert. Analyze this anomaly:
    Data Source: {data_source}
    Anomaly: {anomaly_description}
    Provide: 1) Likely cause 2) Risk level 3) Recommended action.
    Keep response under 100 words.
    """
    return get_gemini_response(prompt)

def generate_audit_summary(audit_logs: list) -> str:
    prompt = f"""
    Summarize these ESG audit trail entries for a regulator report:
    {audit_logs}
    Provide a 2-3 sentence professional summary highlighting key changes and compliance status.
    """
    return get_gemini_response(prompt)
