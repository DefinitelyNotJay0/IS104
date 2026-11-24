import { useApp } from '../context/AppContext.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ConcernTable from '../components/ConcernTable.jsx'
import { facilities } from '../data/mock.js'
import { PRIORITY_RANK, STATUSES } from '../utils/helpers.js'

const COLORS = ['bg-amber-500', 'bg-blue-600', 'bg-violet-600', 'bg-emerald-600']
const INTRO = {
  admin: ['Campus overview', 'Monitor campus concerns and see which repairs need your attention.'],
  staff: ['My repair workspace', 'Review your assignments and keep repair progress up to date.'],
  user: ['My campus reports', 'Track your facility concerns from the first report through the final repair.'],
}

export default function Dashboard() {
  const { user, concerns, openConcernQueue, setPage } = useApp()
  const { role } = user
  const rows = role === 'admin' ? concerns : role === 'staff' ? concerns.filter((c) => c.assigned === user.name) : concerns.filter((c) => c.reporter === user.name)
  const counts = Object.fromEntries(STATUSES.map((status) => [status, rows.filter((c) => c.status === status).length]))
  const urgent = rows.filter((c) => c.status === 'Pending' && ['High', 'Critical'].includes(c.priority)).length
  const queue = [...rows].sort((a, b) => role === 'admin'
    ? Number(a.status === 'Completed') - Number(b.status === 'Completed') || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.createdAt - a.createdAt
    : b.createdAt - a.createdAt)
  const stats = [
    [role === 'admin' ? 'Total reports' : role === 'staff' ? 'Assigned to me' : 'My reports', rows.length, 'All recorded concerns'],
    role === 'staff' ? ['For verification', counts['For Verification'], 'Awaiting administrator check'] : ['Pending', counts.Pending, 'Awaiting review and assignment'],
    ['In progress', role === 'admin' || role === 'staff' ? counts['In Progress'] : counts['In Progress'] + counts['For Verification'], 'Repairs being handled'],
    ['Completed', counts.Completed, 'Verified repairs'],
  ]
  const facilityCounts = facilities.map(({ name }) => [name, rows.filter((c) => c.facility === name).length])
  const maxFacility = Math.max(1, ...facilityCounts.map(([, count]) => count))

  return (
    <>
      <div><h1 className="page-title">{INTRO[role][0]}</h1><p className="page-description">{INTRO[role][1]}</p></div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">{stats.map(([label, value, note]) => <StatCard key={label} label={label} value={value} note={note} />)}</div>
      {role === 'admin' && (urgent > 0 || counts['For Verification'] > 0) && (
        <section className="grid gap-3 sm:grid-cols-2" aria-label="Needs attention">
          {urgent > 0 && <button type="button" onClick={() => openConcernQueue('Pending')} className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-left text-sm text-amber-950 hover:border-amber-400"><span><strong>{urgent}</strong> high-priority {urgent === 1 ? 'concern needs' : 'concerns need'} review</span><span className="font-semibold">Review queue →</span></button>}
          {counts['For Verification'] > 0 && <button type="button" onClick={() => openConcernQueue('For Verification')} className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-left text-sm text-violet-900 hover:border-violet-400"><span><strong>{counts['For Verification']}</strong> awaiting verification</span><span className="font-semibold">Open queue →</span></button>}
        </section>
      )}
      <section className="card p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3">
          <h2 className="section-title">{role === 'admin' ? 'Priority concern queue' : role === 'staff' ? 'My assigned repairs' : 'Recent reports'}</h2>
          {rows.length > 0 && <button type="button" className="min-h-11 text-sm font-semibold text-brand-dark" onClick={() => role === 'admin' ? openConcernQueue() : setPage('status')}>{role === 'admin' ? 'View all concerns' : 'Open repair status'} →</button>}
        </div>
        <ConcernTable rows={queue.slice(0, 5)} empty={role === 'user' ? 'Your submitted concerns will appear here.' : undefined} />
      </section>
      {role === 'admin' && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="card p-4 sm:p-5">
            <h2 className="section-title">Reports by status</h2>
            <div className="mt-4 flex h-3 gap-0.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">{STATUSES.map((status, i) => counts[status] > 0 && <span key={status} className={COLORS[i]} style={{ flexGrow: counts[status] }} />)}</div>
            <ul className="mt-3 divide-y divide-slate-100">{STATUSES.map((status, i) => <li key={status} className="flex items-center gap-2 py-2 text-sm"><span className={`size-2.5 rounded-full ${COLORS[i]}`} aria-hidden="true" /><span className="flex-1">{status}</span><strong>{counts[status]}</strong></li>)}</ul>
          </section>
          <section className="card p-4 sm:p-5">
            <h2 className="section-title">Reports by facility</h2>
            <ul className="mt-4 space-y-3">{facilityCounts.map(([name, count]) => <li key={name} className="text-sm"><div className="mb-1 flex justify-between gap-2"><span>{name}</span><strong>{count}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true"><div className="h-full rounded-full bg-brand" style={{ width: `${count / maxFacility * 100}%` }} /></div></li>)}</ul>
          </section>
        </div>
      )}
    </>
  )
}
