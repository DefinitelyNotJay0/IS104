import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Badge from '../components/ui/Badge.jsx'
import { fmt } from '../utils/helpers.js'
function StaffForm({ c }) {
  const { submitRepairReport } = useApp()
  const [note, setNote] = useState(''), [progress, setProgress] = useState(c.progress), [done, setDone] = useState(false)
  return (
    <div className="card p-5 space-y-3"><b className="text-sm">Submit repair session report</b><p className="text-xs text-slate-500">Progress updates are entered manually after each repair session.</p>
      <textarea className="input h-20" placeholder="What was done in this session?" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="text-xs"><label className="label">Progress: {done ? 100 : progress}%</label><input type="range" min="0" max="100" step="10" disabled={done} value={done ? 100 : progress} onChange={(e) => setProgress(+e.target.value)} className="w-full" /></div>
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />Repair finished: send to administrator for verification</label>
      <button className="btn" onClick={() => submitRepairReport(c.id, { note, progress, done })}>Send report to administrator</button></div>
  )
}
function VerifyForm({ c }) {
  const { verifyConcern } = useApp()
  const [fb, setFb] = useState('The repair was inspected and the concern is resolved. Thank you for reporting.')
  return (
    <div className="card p-5 space-y-3 border-violet-300"><b className="text-sm">Verify completion & notify reporter</b><p className="text-xs text-slate-500">{c.assigned} marked this repair as finished. Inspect it, then send feedback to {c.reporter}.</p>
      <textarea className="input h-20" value={fb} onChange={(e) => setFb(e.target.value)} />
      <button className="btn" onClick={() => verifyConcern(c.id, fb)}>✓ Verify as completed</button></div>
  )
}
export default function RepairStatus() {
  const { user, concerns, selectedId, setSelectedId, setReviewing, confirmResolved } = useApp()
  const list = user.role === 'admin' ? concerns : user.role === 'staff' ? concerns.filter((c) => c.assigned === user.name) : concerns.filter((c) => c.reporter === user.name)
  const c = list.find((x) => x.id === selectedId) || list[0]
  if (!c) return <div className="card p-6 text-sm">No concerns to show yet.</div>
  const pending = !c.assigned
  return (
    <>
      <div><p className="text-[10px] font-bold text-brand">REPAIR WORKSPACE · {c.id}</p>
        <div className="flex justify-between gap-3 flex-wrap"><h1 className="text-2xl font-bold">{c.title}</h1>
          <select className="input w-64" value={c.id} onChange={(e) => setSelectedId(e.target.value)}>{list.map((x) => <option key={x.id} value={x.id}>{x.id} · {x.title}</option>)}</select></div>
        <p className="text-xs text-slate-500">{c.facility} · {c.loc} · Reported {fmt(c.createdAt)}</p></div>
      <div className="card p-4 flex flex-wrap justify-between items-center gap-4 text-xs"><span>Status <Badge value={c.status} /></span><span>Priority <Badge value={c.priority} /></span><span>Assigned staff <b>{c.assigned || 'Not yet assigned'}</b></span>
        <div className="w-56"><div className="flex justify-between"><span>Repair progress</span><b>{c.progress}%</b></div><div className="h-1.5 bg-slate-100 rounded mt-1"><div className="h-1.5 bg-brand rounded" style={{ width: `${c.progress}%` }} /></div></div></div>
      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-4">
          <div className="card p-5"><b className="text-sm">Repair progress timeline</b>
            <ol className="mt-4 space-y-5">
              {c.log.map((e, i) => <li key={i} className="flex gap-3"><span className="w-6 h-6 rounded-full grid place-items-center text-[11px] bg-emerald-100 text-emerald-700">✓</span><div className="flex-1"><div className="flex justify-between"><b className="text-sm">{e.title}</b><span className="text-[11px] text-slate-400">{fmt(e.at)}</span></div><p className="text-xs text-slate-500">{e.desc}</p></div></li>)}
              {c.status !== 'Completed' && <li className="flex gap-3"><span className="w-6 h-6 rounded-full grid place-items-center text-[11px] bg-slate-100 text-slate-400">⚑</span><div><b className="text-sm">{pending ? 'Awaiting administrator review' : c.status === 'For Verification' ? 'Awaiting admin verification' : 'Next: repair session report'}</b></div></li>}
            </ol></div>
          {user.role === 'admin' && pending && <button className="btn" onClick={() => setReviewing(c)}>Review priority & assign</button>}
          {user.role === 'staff' && c.status === 'In Progress' && c.assigned === user.name && <StaffForm key={c.id + c.log.length} c={c} />}
          {user.role === 'admin' && c.status === 'For Verification' && <VerifyForm key={c.id} c={c} />}
          {user.role === 'user' && c.status === 'Completed' && c.reporter === user.name && (c.confirmed ? <p className="text-xs text-emerald-700">✓ You confirmed this concern is resolved.</p> : <button className="btn" onClick={() => confirmResolved(c.id)}>Confirm it’s fixed</button>)}
        </div>
        <div className="card p-5 text-xs space-y-2 h-fit"><b className="text-sm">Concern details</b>{[['Category', c.category], ['Building', c.facility], ['Floor / Room', c.loc], ['Reported by', c.reporter]].map(([k, v]) => <div key={k} className="flex justify-between"><span className="text-slate-400">{k}</span><b>{v}</b></div>)}
          <p className="italic text-slate-500 pt-2 border-t">“{c.desc}”</p>
          {c.photo ? <img src={c.photo} alt="evidence" className="rounded-lg w-full" /> : <div className="h-20 bg-slate-100 rounded-lg grid place-items-center text-slate-400">No photo attached</div>}</div>
      </div>
    </>
  )
}
