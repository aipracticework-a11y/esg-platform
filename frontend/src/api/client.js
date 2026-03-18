import axios from 'axios'

const api = axios.create({
  baseURL: 'https://esg-platform-api-3b9r.onrender.com', 
  timeout: 30000,
})

export const getDashboard    = () => api.get('/api/dashboard/summary')
export const getLineageGraph = () => api.get('/api/lineage/graph')
export const getNodeDetail   = (id) => api.get(`/api/lineage/node/${id}`)
export const getNodeAI       = (id) => api.get(`/api/lineage/ai-summary/${id}`)
export const getModels       = () => api.get('/api/explainability/models')
export const getEstimates    = () => api.get('/api/explainability/estimates')
export const explainEstimate = (id) => api.get(`/api/explainability/explain/${id}`)
export const semanticSearch  = (q) => api.get(`/api/explainability/search?query=${encodeURIComponent(q)}`)
export const getDataSources  = () => api.get('/api/quality/sources')
export const getAnomalies    = () => api.get('/api/quality/anomalies')
export const analyzeAnomaly  = (id) => api.get(`/api/quality/anomaly/${id}/analyze`)
export const getQualityRules = () => api.get('/api/quality/rules')
export const getQualityTrend = () => api.get('/api/quality/trend')
export const getAuditLogs    = () => api.get('/api/audit/logs')
export const getAuditSummary = () => api.get('/api/audit/ai-summary')
export const getSuppliers    = () => api.get('/api/supplier/list')
export const getSupplierRisk = (id) => api.get(`/api/supplier/${id}/risk-analysis`)
export const getControls     = () => api.get('/api/reporting/controls')
export const getEmissions    = () => api.get('/api/reporting/emissions-summary')
export const getAIReadiness  = () => api.get('/api/reporting/ai-readiness')
export const generateReport  = (fw) => api.get(`/api/reporting/generate-report?framework=${fw}`)

export default api
