import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import ConcernTable from '../components/ConcernTable.jsx'
const TABS = ['All concerns', 'Pending', 'In Progress', 'For Verification', 'Completed']
const RANK = { Critical: 0, High: 1, Medium: 2, Low: 3 }
export default function FacilityConcerns() {
  const { concerns } = useApp()
  const [tab, setTab] = useState(TABS[0]), [q, setQ] = useState('')
  const rows = concerns.filter((c) => (tab === TABS[0] || c.status === tab) && (c.title + c.id).toLowerCase().includes(q.toLowerCase())).sort((a, b) => RANK[a.priority] - RANK[b.priority])
  return (
    <>
      <div><p className="text-[10px] font-bold text-brand">CAMPUS OPERATIONS</p><h1 className="text-2xl font-bold">Facility concerns</h1><p className="text-xs text-slate-500">One place to review, prioritize, route, and verify every campus concern.</p></div>
      <div className="flex gap-2 flex-wrap">{TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${tab === t ? 'bg-navy text-white' : 'bg-white border-slate-200'}`}>{t} {t !== TABS[0] && <span className="opacity-60">{concerns.filter((c) => c.status === t).length}</span>}</button>)}</div>
      <div className="card p-4 space-y-3"><input className="input max-w-sm" placeholder="Search concern or report ID" value={q} onChange={(e) => setQ(e.target.value)} /><ConcernTable rows={rows} /><p className="text-[11px] text-slate-400 px-3">Showing {rows.length} concerns · Priority: highest first</p></div>
    </>
  )
}
