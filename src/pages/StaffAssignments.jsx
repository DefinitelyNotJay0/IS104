import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Badge from '../components/ui/Badge.jsx'
import { staff } from '../data/mock.js'
import { suggestStaff, workload } from '../utils/helpers.js'
const RANK = { Critical: 0, High: 1, Medium: 2, Low: 3 }
export default function StaffAssignments() {
  const { concerns, setReviewing } = useApp()
  const pending = concerns.filter((c) => c.status === 'Pending').sort((a, b) => RANK[a.priority] - RANK[b.priority])
  const [sel, setSel] = useState(null)
  const pc = pending.find((c) => c.id === sel) || pending[0]
  const rec = pc && suggestStaff(staff, concerns, pc.category)
  const active = concerns.filter((c) => ['In Progress', 'For Verification'].includes(c.status)).length
  return (
    <>
      <div><p className="text-[10px] font-bold text-brand">CAMPUS OPERATIONS</p><h1 className="text-2xl font-bold">The right repair. The right person.</h1><p className="text-xs text-slate-500">Route each concern to maintenance personnel by reviewed priority and expertise.</p></div>
      <div className="card p-4 flex gap-10 text-sm"><span><b className="text-2xl">{staff.length}</b> Maintenance staff</span><span><b className="text-2xl">{active}</b> Active repairs</span><span><b className="text-2xl">{pending.length}</b> Awaiting assignment</span></div>
      <div className="grid md:grid-cols-3 gap-4">{staff.map((m) => { const w = workload(concerns, m.name); return <div key={m.id} className={`card p-4 ${rec?.id === m.id ? 'border-brand ring-2 ring-brand/20' : ''}`}><b>{m.name}</b><p className="text-xs text-slate-400">{m.role}</p><p className="text-[11px] mt-1">Handles: {m.skills.join(', ')}</p><p className="mt-3"><b className="text-2xl">{w}</b> <span className="text-xs">active repairs</span></p><div className="h-1.5 bg-slate-100 rounded mt-2"><div className="h-1.5 bg-brand rounded" style={{ width: `${Math.min(w * 25, 100)}%` }} /></div></div> })}</div>
      <div className="grid lg:grid-cols-[1fr_340px] gap-4">
        <div className="card p-5 space-y-3"><b className="text-sm">Next to assign</b>{pending.map((c) => <button key={c.id} onClick={() => setSel(c.id)} className={`w-full text-left border rounded-lg p-3 text-sm flex justify-between ${pc?.id === c.id ? 'border-brand bg-brand-soft' : ''}`}><div><b>{c.title}</b><p className="text-[11px] text-slate-400">{c.id} · {c.facility} · {c.loc} · {c.category}</p></div><Badge value={c.priority} /></button>)}{!pending.length && <p className="text-xs text-slate-400">All concerns have been assigned.</p>}</div>
        {pc && <div className="card p-5 text-sm h-fit"><b>Assignment preview</b><p className="text-xs text-slate-400">No changes until you confirm the review.</p><p className="mt-3 text-xs text-slate-500">{pc.id} · {pc.title}</p><p className="mt-2 font-semibold">{rec.name}</p><p className="text-xs text-slate-500">{rec.role} matches this concern</p><p className="text-xs bg-brand-soft rounded p-2 mt-2">Active repairs after assignment: <b>{workload(concerns, rec.name)} → {workload(concerns, rec.name) + 1}</b></p><button className="btn w-full justify-center mt-3" onClick={() => setReviewing(pc)}>→ Review priority & assign</button></div>}
      </div>
      <p className="text-[11px] text-slate-500">Staff update their own repairs after each session. Priority review and assignment are managed by administrators.</p>
    </>
  )
}
