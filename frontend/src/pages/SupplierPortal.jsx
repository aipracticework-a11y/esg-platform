import { useEffect, useState } from 'react'
import { getSuppliers, getSupplierRisk } from '../api/client'
import { Truck, Loader, X } from 'lucide-react'

const STATUS_BADGE = { approved:'badge-green', needs_review:'badge-amber', rejected:'badge-red', pending:'badge-gray' }
const STATUS_LABEL = { approved:'✅ Approved', needs_review:'⚠️ Needs Review', rejected:'❌ Rejected', pending:'⏳ Pending' }

function ProgressBar({ value }) {
  const color = value >= 90 ? 'bg-green-500' : value >= 60 ? 'bg-amber-500' : value >= 30 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }} />
    </div>
  )
}

function RiskPanel({ supplier, onClose }) {
  const [risk, setRisk] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getSupplierRisk(supplier.id).then(r => { setRisk(r.data); setLoading(false) })
  }, [supplier.id])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b bg-[#0f2340] rounded-t-2xl">
          <h3 className="font-bold text-white">Supplier Risk Analysis</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
        </div>
        {loading ? <div className="p-8 text-center text-slate-400"><Loader className="w-8 h-8 animate-spin mx-auto mb-3" />Analyzing supplier risk...</div> : risk && (
          <div className="p-6 space-y-4">
            <div>
              <h4 className="font-bold text-slate-800">{risk.supplier.name}</h4>
              <div className="flex items-center gap-3 mt-2">
                <span className={STATUS_BADGE[risk.supplier.status]}>{STATUS_LABEL[risk.supplier.status]}</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${risk.overall_risk === 'low' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {risk.overall_risk.toUpperCase()} RISK
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg"><div className="text-slate-400">Country</div><div className="font-medium mt-1">{risk.supplier.country}</div></div>
              <div className="bg-slate-50 p-3 rounded-lg"><div className="text-slate-400">Certification</div><div className="font-medium mt-1">{risk.supplier.certification}</div></div>
              <div className="bg-slate-50 p-3 rounded-lg"><div className="text-slate-400">Quality Score</div><div className="font-bold mt-1 text-green-600">{risk.supplier.quality_score}/100</div></div>
              <div className="bg-slate-50 p-3 rounded-lg"><div className="text-slate-400">Scope</div><div className="font-medium mt-1">{risk.supplier.scope}</div></div>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
              <div className="font-semibold text-purple-700 mb-2">🤖 AI Risk Analysis</div>
              <p className="text-sm text-slate-700 whitespace-pre-line">{risk.risk_analysis}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SupplierPortal() {
  const [suppliers, setSuppliers] = useState([])
  const [summary, setSummary] = useState({})
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSuppliers().then(r => { setSuppliers(r.data.suppliers); setSummary(r.data.summary); setLoading(false) })
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Truck className="w-6 h-6 text-amber-500" /> Supplier Data Portal</h1>
        <p className="text-slate-500 mt-1">Manage supplier submissions, quality scores and risk assessments</p>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        {[
          { label: 'Total Suppliers', value: summary.total, color: 'text-slate-800' },
          { label: 'Approved', value: summary.approved, color: 'text-green-600' },
          { label: 'Pending Review', value: summary.pending_review, color: 'text-amber-600' },
          { label: 'Rejected', value: summary.rejected, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-700 mb-4">Supplier List</h2>
        <div className="space-y-4">
          {suppliers.map(s => (
            <div key={s.id} className="border rounded-xl p-5 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.contact} · {s.country}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={STATUS_BADGE[s.status]}>{STATUS_LABEL[s.status]}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                <div><div className="text-slate-400">Scope</div><div className="font-medium">{s.scope}</div></div>
                <div><div className="text-slate-400">Quality</div><div className="font-bold text-green-600">{s.quality_score}/100</div></div>
                <div><div className="text-slate-400">Certification</div><div className="font-medium">{s.certification}</div></div>
                <div><div className="text-slate-400">Last Submission</div><div className="font-medium">{s.last_submission || 'Never'}</div></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Submission Progress</span><span>{s.progress}%</span>
                </div>
                <ProgressBar value={s.progress} />
              </div>
              <button onClick={() => setSelected(s)} className="mt-3 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-200">
                🤖 AI Risk Analysis →
              </button>
            </div>
          ))}
        </div>
      </div>

      {selected && <RiskPanel supplier={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
