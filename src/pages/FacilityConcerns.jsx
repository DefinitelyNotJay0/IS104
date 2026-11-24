import { useApp } from '../context/AppContext.jsx'
import ConcernTable from '../components/ConcernTable.jsx'
import Icon from '../components/ui/Icon.jsx'
import { PRIORITY_RANK, STATUSES } from '../utils/helpers.js'

const TABS = ['All concerns', ...STATUSES]

export default function FacilityConcerns() {
  const { concerns, concernFilter, setConcernFilter, concernQuery, setConcernQuery } = useApp()
  const query = concernQuery.trim().toLowerCase()
  const rows = concerns
    .filter((c) => (concernFilter === TABS[0] || c.status === concernFilter) && [c.title, c.id, c.facility, c.loc, c.category, c.assigned].some((value) => value?.toLowerCase().includes(query)))
    .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.createdAt - a.createdAt)

  return (
    <>
      <div><h1 className="page-title">Facility concerns</h1><p className="page-description">Review incoming reports, assign repairs, and verify completed work.</p></div>
      <section className="card space-y-4 p-4 sm:p-5" aria-label="Concern queue">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" role="group" aria-label="Filter by status">
          {TABS.map((status) => <button key={status} type="button" onClick={() => setConcernFilter(status)} aria-pressed={concernFilter === status} className="choice px-3">{status} <span className="ml-1 text-xs text-slate-600">{status === TABS[0] ? concerns.length : concerns.filter((c) => c.status === status).length}</span></button>)}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="w-full sm:max-w-sm"><label htmlFor="concern-search" className="label">Search concerns</label><div className="relative"><Icon name="search" className="pointer-events-none absolute left-3 top-3.5 size-4 text-slate-600" /><input id="concern-search" type="search" className="input pl-9" placeholder="Title, report ID, location or staff" value={concernQuery} onChange={(e) => setConcernQuery(e.target.value)} /></div></div>
          <p className="pb-1 text-sm text-slate-600" role="status">{rows.length} {rows.length === 1 ? 'concern' : 'concerns'} · Highest priority first</p>
        </div>
        <ConcernTable rows={rows} empty={query ? 'No concerns match your search.' : 'No concerns in this status.'} />
      </section>
    </>
  )
}
