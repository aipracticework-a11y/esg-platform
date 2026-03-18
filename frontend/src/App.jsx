import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, GitBranch, Brain, ShieldCheck, ClipboardList, Truck, FileBarChart2, Leaf } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import DataLineage from './pages/DataLineage'
import AIExplainability from './pages/AIExplainability'
import DataQuality from './pages/DataQuality'
import AuditTrail from './pages/AuditTrail'
import SupplierPortal from './pages/SupplierPortal'
import ReportingHub from './pages/ReportingHub'

const navItems = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/lineage',       icon: GitBranch,       label: 'Data Lineage' },
  { to: '/explainability',icon: Brain,           label: 'AI Explainability' },
  { to: '/quality',       icon: ShieldCheck,     label: 'Data Quality' },
  { to: '/audit',         icon: ClipboardList,   label: 'Audit Trail' },
  { to: '/suppliers',     icon: Truck,           label: 'Supplier Portal' },
  { to: '/reporting',     icon: FileBarChart2,   label: 'Reporting Hub' },
]

function Sidebar() {
  const location = useLocation()
  return (
    <div className="w-64 min-h-screen bg-[#0f2340] flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">ESG Trust</div>
            <div className="text-slate-400 text-xs">Platform v1.0</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-slate-500 text-center">Theme 7: Data Trust &</div>
        <div className="text-xs text-slate-500 text-center">Governance & Assurance</div>
      </div>
    </div>
  )
}

function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-slate-50 p-8">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/lineage"        element={<DataLineage />} />
          <Route path="/explainability" element={<AIExplainability />} />
          <Route path="/quality"        element={<DataQuality />} />
          <Route path="/audit"          element={<AuditTrail />} />
          <Route path="/suppliers"      element={<SupplierPortal />} />
          <Route path="/reporting"      element={<ReportingHub />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
