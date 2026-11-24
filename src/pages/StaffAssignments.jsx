import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import Badge from '../components/ui/Badge.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import { staff } from '../data/mock.js'
import { ACTIVE, PRIORITY_RANK, suggestStaff, workload } from '../utils/helpers.js'

export default function StaffAssignments() {
  const { concerns, setReviewing } = useApp()
  const [selectedId, setSelectedId] = useState(null)
  const pending = concerns.filter((c) => c.status === 'Pending')
    .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.createdAt - a.createdAt)
  const selected = pending.find((c) => c.id === selectedId) || pending[0]
  const recommendation = selected && suggestStaff(staff, concerns, selected.category)
  const active = concerns.filter((c) => ACTIVE.includes(c.status)).length
  const recommendedWorkload = recommendation && workload(concerns, recommendation.name)

  return (
    <>
      <div><h1 className="page-title">Staff assignments</h1><p className="page-description">Review workloads and route pending concerns to a maintenance specialist.</p></div>
      <div className="grid gap-3 min-[480px]:grid-cols-3 sm:gap-4">
        <StatCard label="Maintenance staff" value={staff.length} note="Team members" />
        <StatCard label="Active repairs" value={active} note="In progress or awaiting verification" />
        <StatCard label="Awaiting assignment" value={pending.length} note="Pending review" />
      </div>
      <section aria-labelledby="team-workload">
        <h2 id="team-workload" className="section-title mb-3">Team workload</h2>
        <ul className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {staff.map((member) => (
            <li key={member.id} className="card p-4">
              <h3 className="font-semibold">{member.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{member.role}</p>
              <p className="mt-1 text-xs text-slate-600">{member.skills.join(' · ')}</p>
              <p className="mt-3 text-sm"><strong className="text-xl">{workload(concerns, member.name)}</strong> active repairs</p>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]">
        <section className="card space-y-3 p-4 sm:p-5">
          <h2 className="section-title">Pending assignments</h2>
          {pending.map((concern) => (
            <button key={concern.id} type="button" onClick={() => setSelectedId(concern.id)} aria-pressed={selected?.id === concern.id} className="choice flex w-full flex-wrap items-center justify-between gap-2 p-3 text-left">
              <span className="min-w-0 flex-1"><strong>{concern.title}</strong><span className="mt-1 block text-xs font-normal text-slate-600">{concern.id} · {concern.facility} · {concern.loc} · {concern.category}</span></span>
              <Badge value={concern.priority} />
            </button>
          ))}
          {!pending.length && <p className="text-sm text-slate-600">No concerns are waiting for assignment.</p>}
        </section>
        {selected && (
          <section className="card space-y-3 p-4 sm:p-5">
            <h2 className="section-title">Suggested assignment</h2>
            <p className="text-sm text-slate-600">{selected.id} · {selected.title}</p>
            <div className="rounded-xl bg-brand-soft p-3 text-sm">
              <p className="font-semibold">{recommendation.name}</p>
              <p className="mt-1 text-slate-700">{recommendation.role}</p>
              <p className="mt-2 text-slate-700">{recommendedWorkload} active now · {recommendedWorkload + 1} after assignment</p>
            </div>
            <button type="button" className="btn w-full" onClick={() => setReviewing(selected)}>Review priority and assign</button>
          </section>
        )}
      </div>
    </>
  )
}
