import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { staff } from '../data/mock.js'
import { fmt, level, suggestStaff, workload } from '../utils/helpers.js'
const SEV = ['Low', 'Medium', 'High', 'Critical']
const URG = [['Low · 1', 1], ['Moderate · 2', 2], ['Immediate · 3 — Risk to people in the space', 3]]
function Form({ c }) {
  const { concerns, assignConcern, setReviewing } = useApp()
  const rec = suggestStaff(staff, concerns, c.category)
  const [sev, setSev] = useState(2), [urg, setUrg] = useState(c.urg || 2), [who, setWho] = useState(rec.name), [note, setNote] = useState('')
  const score = sev * urg, pr = level(score)
  const confirm = () => { assignConcern(c.id, { priority: pr, severity: sev, urg, staffName: who, note }); setReviewing(null) }
  return (
    <div className="fixed inset-0 bg-navy/60 grid place-items-center z-50 p-4">
      <div className="card w-full max-w-4xl p-6 max-h-[92vh] overflow-auto">
        <div className="flex justify-between"><h2 className="font-bold text-lg">Priority Determination & Review</h2><button onClick={() => setReviewing(null)}>✕</button></div>
        <div className="bg-brand-soft rounded-lg p-3 my-3 text-sm"><b>{c.id} · {c.title}</b><div className="text-xs text-slate-500">{c.facility} · {c.loc} · Reported by {c.reporter}, {fmt(c.createdAt)}</div></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div><span className="label">Severity (set by administrator)</span><div className="grid grid-cols-4 gap-2">{SEV.map((s, i) => <button key={s} onClick={() => setSev(i + 1)} className={`border rounded-lg py-2 text-xs ${sev === i + 1 ? 'border-brand bg-brand-soft font-bold text-brand' : 'border-slate-200'}`}>{s}</button>)}</div></div>
            <div><span className="label">Urgency</span><select className="input" value={urg} onChange={(e) => setUrg(+e.target.value)}>{URG.map(([l, v]) => <option key={v} value={v}>{l}</option>)}</select><p className="text-[11px] text-slate-400 mt-1">Reporter's self-rating: {['', 'Low', 'Moderate', 'Immediate'][c.urg]}. Confirm or change it after reviewing the evidence.</p></div>
            <div className="bg-red-50 text-red-600 rounded-lg p-3"><p className="text-[10px] font-bold">AUTO-CALCULATED PRIORITY</p><p className="font-bold text-lg">{pr} · score {score}</p><p className="text-xs">Severity {sev} × Urgency {urg} = {score}</p></div>
            <p className="text-[11px] text-slate-400">Scoring: 1–3 Low · 4–6 Medium · 7–9 High · 10–12 Critical.</p>
          </div>
          <div className="space-y-3">
            {c.photo ? <img src={c.photo} alt="evidence" className="rounded-lg max-h-40 w-full object-cover" /> : <div className="h-20 bg-slate-100 rounded-lg grid place-items-center text-xs text-slate-400">No photo attached</div>}
            <p className="text-xs text-slate-500 italic">“{c.desc}”</p>
            <div><span className="label">Assign maintenance staff</span><select className="input" value={who} onChange={(e) => setWho(e.target.value)}>{staff.map((s) => <option key={s.id} value={s.name}>{s.name} · {s.skills.join('/')} · {workload(concerns, s.name)} active{s.name === rec.name ? ' ★ recommended' : ''}</option>)}</select><p className="text-[11px] text-slate-400 mt-1">★ Matches the “{c.category}” category with the lightest workload.</p></div>
            <div><span className="label">Review note</span><textarea className="input h-20" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Instructions for the assigned staff" /></div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5"><button className="btn-ghost" onClick={() => setReviewing(null)}>Cancel</button><button className="btn" onClick={confirm}>✓ Confirm & assign repair</button></div>
      </div>
    </div>
  )
}
export default function ReviewModal() {
  const { reviewing } = useApp()
  return reviewing ? <Form key={reviewing.id} c={reviewing} /> : null
}
