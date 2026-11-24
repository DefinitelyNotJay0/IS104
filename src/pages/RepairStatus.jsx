import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Badge from '../components/ui/Badge.jsx'
import { fmt } from '../utils/helpers.js'

function StaffForm({ concern }) {
  const { submitRepairReport } = useApp()
  const [note, setNote] = useState('')
  const [progress, setProgress] = useState(concern.progress)
  const [done, setDone] = useState(false)
  return (
    <form className="card space-y-3 p-4 sm:p-5" onSubmit={(event) => { event.preventDefault(); submitRepairReport(concern.id, { note, progress, done }) }}>
      <h2 className="section-title">Submit a repair update</h2>
      <div><label htmlFor="session-note" className="label">Session notes</label><textarea id="session-note" className="input min-h-20" placeholder="What did you repair during this session?" value={note} onChange={(event) => setNote(event.target.value)} /></div>
      <div><label htmlFor="session-progress" className="label">Repair progress ({done ? 100 : progress}%)</label><input id="session-progress" type="range" min="0" max="100" step="10" disabled={done} value={done ? 100 : progress} onChange={(event) => setProgress(Number(event.target.value))} className="h-8 w-full accent-brand-dark" /></div>
      <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-5 shrink-0 accent-brand-dark" checked={done} onChange={(event) => setDone(event.target.checked)} />Repair finished and ready for verification</label>
      <button type="submit" className="btn w-full sm:w-auto">{done ? 'Send for verification' : 'Save repair update'}</button>
    </form>
  )
}

function VerifyForm({ concern }) {
  const { verifyConcern } = useApp()
  const [feedback, setFeedback] = useState('The repair was inspected and the concern is resolved. Thank you for reporting.')
  return (
    <form className="card space-y-3 border-violet-300 p-4 sm:p-5" onSubmit={(event) => { event.preventDefault(); verifyConcern(concern.id, feedback) }}>
      <h2 className="section-title">Verify repair completion</h2>
      <p className="text-sm text-slate-600">{concern.assigned} marked this repair as finished. Inspect it before sending feedback to {concern.reporter}.</p>
      <div><label htmlFor="verification-feedback" className="label">Feedback to reporter</label><textarea id="verification-feedback" className="input min-h-20" value={feedback} onChange={(event) => setFeedback(event.target.value)} /></div>
      <button type="submit" className="btn w-full sm:w-auto">Verify as completed</button>
    </form>
  )
}

export default function RepairStatus() {
  const { user, concerns, selectedId, setSelectedId, setReviewing, confirmResolved, setPage } = useApp()
  const list = user.role === 'admin' ? concerns : user.role === 'staff' ? concerns.filter((c) => c.assigned === user.name) : concerns.filter((c) => c.reporter === user.name)
  const concern = list.find((c) => c.id === selectedId) || list[0]
  if (!concern) return <><h1 className="page-title">Repair status</h1><div className="card space-y-3 p-5"><p className="text-sm text-slate-600">{user.role === 'staff' ? 'You don’t have any assigned repairs yet.' : 'There are no concerns to track yet.'}</p>{user.role === 'user' && <button type="button" className="btn" onClick={() => setPage('report')}>Report a problem</button>}</div></>

  const pending = concern.status === 'Pending'
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0"><p className="mb-1 text-xs font-semibold text-brand-dark">{concern.id}</p><h1 className="page-title">{concern.title}</h1><p className="page-description">{concern.facility} · {concern.loc} · Reported {fmt(concern.createdAt)}</p></div>
        <div className="min-w-0 sm:w-64 sm:shrink-0"><label htmlFor="repair-selector" className="label">Select a concern</label><select id="repair-selector" className="input" value={concern.id} onChange={(event) => setSelectedId(event.target.value)}>{list.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.title}</option>)}</select></div>
      </div>
      <dl className="card grid grid-cols-2 gap-x-3 gap-y-4 p-4 text-sm sm:p-5 xl:grid-cols-4">
        <div><dt className="mb-1 text-slate-600">Status</dt><dd><Badge value={concern.status} /></dd></div>
        <div><dt className="mb-1 text-slate-600">Priority</dt><dd><Badge value={concern.priority} /></dd></div>
        <div><dt className="mb-1 text-slate-600">Assigned staff</dt><dd className="font-semibold">{concern.assigned || 'Unassigned'}</dd></div>
        <div><dt className="mb-1 text-slate-600">Repair progress</dt><dd><strong>{concern.progress}%</strong><progress aria-label="Repair progress" value={concern.progress} max="100" className="mt-1 block h-2 w-full accent-brand-dark" /></dd></div>
      </dl>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]">
        <div className="min-w-0 space-y-4">
          <section className="card p-4 sm:p-5">
            <h2 className="section-title">Repair timeline</h2>
            <ol className="mt-4 space-y-4">
              {concern.log.map((entry, index) => <li key={index} className="flex gap-3"><span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-800">✓</span><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-x-3 gap-y-1"><h3 className="text-sm font-semibold">{entry.title}</h3><span className="text-xs text-slate-600">{fmt(entry.at)}</span></div><p className="mt-1 text-sm text-slate-600">{entry.desc}</p></div></li>)}
              {concern.status !== 'Completed' && <li className="flex items-center gap-3"><span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">·</span><p className="text-sm font-semibold">{pending ? 'Awaiting administrator review' : concern.status === 'For Verification' ? 'Awaiting administrator verification' : 'Awaiting the next repair update'}</p></li>}
            </ol>
          </section>
          {user.role === 'admin' && pending && <button type="button" className="btn w-full sm:w-auto" onClick={() => setReviewing(concern)}>Review priority and assign</button>}
          {user.role === 'staff' && concern.status === 'In Progress' && <StaffForm key={concern.id + concern.log.length} concern={concern} />}
          {user.role === 'admin' && concern.status === 'For Verification' && <VerifyForm key={concern.id} concern={concern} />}
          {user.role === 'user' && concern.status === 'Completed' && (concern.confirmed ? <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">You confirmed this concern is resolved.</p> : <button type="button" className="btn w-full sm:w-auto" onClick={() => confirmResolved(concern.id)}>Confirm it’s fixed</button>)}
        </div>
        <section className="card space-y-3 p-4 sm:p-5">
          <h2 className="section-title">Concern details</h2>
          <dl className="divide-y divide-slate-100 text-sm">{[['Category', concern.category], ['Building', concern.facility], ['Floor / room', concern.loc], ['Reported by', concern.reporter]].map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-2 py-2"><dt className="text-slate-600">{label}</dt><dd className="font-semibold">{value}</dd></div>)}</dl>
          <p className="border-t border-slate-200 pt-3 text-sm text-slate-700">{concern.desc}</p>
          {concern.photo ? <img src={concern.photo} alt="Photo attached to the concern" className="max-h-72 w-full rounded-xl bg-slate-100 object-contain" /> : <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">No photo attached.</p>}
        </section>
      </div>
    </>
  )
}
