import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
const CATS = ['Electrical', 'Plumbing', 'Furniture', 'IT/PC Unit']
const FLOORS = ['1st floor', '2nd floor', '3rd floor']
export default function ReportProblem() {
  const { addConcern, setPage } = useApp()
  const [f, setF] = useState({ facility: '', floor: '', room: '', title: '', category: 'Electrical', desc: '', urg: 2 })
  const [photo, setPhoto] = useState(null), [err, setErr] = useState(''), [tried, setTried] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const missing = !f.facility || !f.floor || !f.room || !f.title || !f.desc || !photo
  const pick = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) return setErr('Only PNG or JPG photos are allowed.')
    if (file.size > 5 * 1024 * 1024) return setErr('Photo must be 5MB or smaller.')
    setErr('')
    const r = new FileReader()
    r.onload = () => setPhoto({ name: file.name, size: (file.size / 1048576).toFixed(1), url: r.result })
    r.readAsDataURL(file)
  }
  const submit = () => {
    setTried(true)
    if (missing) return
    addConcern({ title: f.title, facility: f.facility, loc: `${f.floor} · ${f.room}`, category: f.category, urg: +f.urg, priority: ['', 'Low', 'Medium', 'High'][f.urg], desc: f.desc, photo: photo.url })
    setPage('dashboard')
  }
  const bad = (v) => (tried && !v ? 'border-red-400' : '')
  return (
    <>
      <div><p className="text-[10px] font-bold text-brand">CAMPUS CARE STARTS WITH YOU</p><h1 className="text-2xl font-bold">Report a problem</h1><p className="text-xs text-slate-500">Give the precise location, a description, and a photo. We’ll keep you updated at every step.</p></div>
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="card p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Building *</label><select className={`input ${bad(f.facility)}`} onChange={set('facility')}><option value="">Select building</option><option>Library</option><option>Classrooms</option><option>Faculty Room</option><option>Computer Lab</option></select></div>
            <div><label className="label">Floor *</label><select className={`input ${bad(f.floor)}`} onChange={set('floor')}><option value="">Select floor</option>{FLOORS.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div><label className="label">Room *</label><input className={`input ${bad(f.room)}`} placeholder="e.g. L-204" onChange={set('room')} /></div>
          </div>
          <div><label className="label">Problem Title *</label><input className={`input ${bad(f.title)}`} placeholder="Exposed power socket" onChange={set('title')} /></div>
          <div><label className="label">Category *</label><div className="grid grid-cols-4 gap-2">{CATS.map((c) => <button key={c} type="button" onClick={() => setF({ ...f, category: c })} className={`border rounded-lg py-2 text-xs ${f.category === c ? 'border-brand bg-brand-soft text-brand font-bold' : 'border-slate-200'}`}>{c}</button>)}</div></div>
          <div><label className="label">Description *</label><textarea className={`input h-28 ${bad(f.desc)}`} placeholder="Describe the issue, its exact location, and how it affects the space." onChange={set('desc')} /></div>
          <div><label className="label">Urgency Self-Rating *</label><div className="grid grid-cols-3 gap-2">{[['Low', 1], ['Moderate', 2], ['Immediate', 3]].map(([u, v]) => <button key={u} type="button" onClick={() => setF({ ...f, urg: v })} className={`border rounded-lg py-2 text-xs ${f.urg === v ? (v === 3 ? 'border-red-400 bg-red-50 text-red-600 font-bold' : 'border-brand bg-brand-soft font-bold') : 'border-slate-200'}`}>{u}</button>)}</div><p className="text-[11px] text-slate-400 mt-1">Your rating informs the review. An administrator sets the severity and confirms the final priority, so please rate honestly.</p></div>
          <div className="flex justify-end items-center gap-3">{tried && missing && <span className="text-[11px] text-red-600">Complete all required fields, including a photo.</span>}<button className="btn" onClick={submit}>→ Submit concern</button></div>
        </div>
        <div className="space-y-4">
          <div className="card p-4"><b className="text-sm">Visual Evidence *</b>
            <label className={`mt-3 border-2 border-dashed rounded-lg h-28 grid place-items-center text-xs text-slate-400 text-center cursor-pointer ${tried && !photo ? 'border-red-400' : 'border-slate-200'}`}><input type="file" accept="image/png,image/jpeg" className="hidden" onChange={pick} />Click to upload a photo<br />PNG/JPG · up to 5MB</label>
            {err && <p className="text-[11px] text-red-600 mt-2">{err}</p>}
            {photo && <div className="mt-3"><img src={photo.url} alt="evidence" className="rounded-lg w-full h-32 object-cover" /><p className="text-[11px] text-slate-500 mt-1">{photo.name} · {photo.size} MB · Upload complete</p></div>}</div>
          <div className="bg-navy text-slate-300 rounded-xl p-4 text-xs"><b className="text-white text-sm">A useful report goes further.</b><p className="mt-2">Include the room number, a clear photo, and any immediate risks. Avoid including faces or personal information.</p><p className="mt-3 text-white font-semibold">Immediate safety risk?</p><p>Move away from the hazard and contact campus security. Don’t attempt the repair yourself.</p></div>
        </div>
      </div>
    </>
  )
}
