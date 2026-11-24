import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { staff } from '../data/mock.js'
import { fmt, level, suggestStaff, workload } from '../utils/helpers.js'
import Badge from './ui/Badge.jsx'
import Icon from './ui/Icon.jsx'

const SEVERITY = ['Low', 'Medium', 'High', 'Critical']
const URGENCY = ['Low', 'Moderate', 'Immediate']

function ReviewForm({ concern }) {
  const { concerns, assignConcern, setReviewing } = useApp()
  const suggested = suggestStaff(staff, concerns, concern.category)
  const [severity, setSeverity] = useState(2)
  const [urgency, setUrgency] = useState(concern.urg || 2)
  const [assignee, setAssignee] = useState(suggested.name)
  const [note, setNote] = useState('')
  const dialog = useRef(null)
  const close = () => setReviewing(null)
  const score = severity * urgency
  const priority = level(score)

  useEffect(() => {
    const element = dialog.current
    element.showModal()
    return () => element.close()
  }, [])

  const submit = (event) => {
    event.preventDefault()
    assignConcern(concern.id, { priority, severity, urg: urgency, staffName: assignee, note: note.trim() })
    close()
  }

  return (
    <dialog ref={dialog} aria-labelledby="review-title" onCancel={(event) => { event.preventDefault(); close() }}
      className="card fixed inset-0 m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-3xl overflow-y-auto p-0 text-ink backdrop:bg-navy/65 sm:max-h-[calc(100dvh-3rem)]">
      <form onSubmit={submit}>
        <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2 sm:px-6">
          <h2 id="review-title" className="section-title">Review priority and assign</h2>
          <button type="button" aria-label="Close review" className="icon-button" onClick={close} autoFocus><Icon name="close" /></button>
        </header>
        <div className="space-y-4 p-4 sm:p-6">
          <div className="rounded-xl bg-brand-soft p-3 text-sm"><p className="font-bold">{concern.id} · {concern.title}</p><p className="mt-1 text-xs text-slate-600">{concern.facility} · {concern.loc} · {concern.reporter} · {fmt(concern.createdAt)}</p></div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <section className="min-w-0 space-y-3" aria-label="Reported evidence">
              <p className="text-sm text-slate-700">{concern.desc}</p>
              {concern.photo ? <img src={concern.photo} alt="Photo attached to the concern" className="max-h-52 w-full rounded-xl bg-slate-100 object-contain" /> : <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">No photo attached.</p>}
              <fieldset><legend className="label">Severity</legend><div className="grid grid-cols-2 gap-2">{SEVERITY.map((value, index) => <button type="button" key={value} onClick={() => setSeverity(index + 1)} aria-pressed={severity === index + 1} className="choice">{value}</button>)}</div></fieldset>
              <div><label htmlFor="review-urgency" className="label">Urgency</label><select id="review-urgency" className="input" value={urgency} onChange={(event) => setUrgency(Number(event.target.value))}>{URGENCY.map((value, index) => <option key={value} value={index + 1}>{value}</option>)}</select><p className="mt-1 text-xs text-slate-600">Reporter’s rating was {URGENCY[(concern.urg || 2) - 1].toLowerCase()}.</p></div>
            </section>
            <section className="min-w-0 space-y-3" aria-label="Priority and assignment">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3" aria-live="polite"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">Calculated priority</strong><Badge value={priority} /></div><p className="mt-1 text-xs text-slate-600">Severity {severity} × urgency {urgency} = {score}</p><p className="mt-1 text-xs text-slate-600">1–3 Low · 4–6 Medium · 7–9 High · 10–12 Critical</p></div>
              <div><label htmlFor="review-assignee" className="label">Assign maintenance staff</label><select id="review-assignee" className="input" value={assignee} onChange={(event) => setAssignee(event.target.value)}>{staff.map((member) => <option key={member.id} value={member.name}>{member.name} · {workload(concerns, member.name)} active</option>)}</select><p className="mt-1 text-xs text-slate-600">Suggested for {concern.category} based on skills and workload. <strong>{suggested.name}</strong></p></div>
              <div><label htmlFor="review-note" className="label">Assignment note <span className="font-normal text-slate-600">(optional)</span></label><textarea id="review-note" className="input min-h-20" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Instructions for the assigned staff" /></div>
            </section>
          </div>
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-4 py-3 sm:px-6"><button type="button" className="btn-ghost flex-1 sm:flex-none" onClick={close}>Cancel</button><button type="submit" className="btn flex-1 sm:flex-none">Confirm and assign</button></footer>
      </form>
    </dialog>
  )
}

export default function ReviewModal() {
  const { reviewing } = useApp()
  return reviewing ? <ReviewForm key={reviewing.id} concern={reviewing} /> : null
}
