import StatCard from '../components/ui/StatCard.jsx'
import TrendChart from '../components/ui/TrendChart.jsx'
import ReportGenerator from '../components/ReportGenerator.jsx'
import ConcernTable from '../components/ConcernTable.jsx'
import { useApp } from '../context/AppContext.jsx'
import { facilities, categories } from '../data/mock.js'
import { percentage, summarize } from '../utils/analytics.js'

const hours = (value) => value === null ? '—' : `${value} h`

export default function Analytics() {
  const { concerns, openConcernQueue } = useApp()
  const stats = summarize({ concerns, facilities, categories })
  const busiest = [...stats.facilities].sort((a, b) => b.open - a.open)[0]

  return (
    <>
      <div><h1 className="page-title">Analytics and history</h1><p className="page-description">See repair performance, review completed concerns, and export reports.</p></div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Total reports" value={stats.total} note={`${stats.total - stats.done} open`} />
        <StatCard label="Completion rate" value={`${stats.rate}%`} note={`${stats.done} of ${stats.total} completed`} />
        <StatCard label="Average response" value={hours(stats.responseHrs)} note="Report to assignment" />
        <StatCard label="Average completion" value={hours(stats.completionHrs)} note="Report to verified completion" />
      </div>
      {stats.urgent.length > 0 && <div className="flex flex-wrap items-center justify-between gap-x-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-950"><p><strong>{stats.urgent.length}</strong> high-priority {stats.urgent.length === 1 ? 'concern is' : 'concerns are'} waiting for review.</p><button type="button" className="min-h-11 font-semibold" onClick={() => openConcernQueue('Pending')}>Review queue →</button></div>}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="card p-4 sm:p-5"><h2 className="section-title">Reports and completed repairs</h2><p className="mb-4 mt-1 text-sm text-slate-600">Cumulative totals over the last 7 days.</p><TrendChart data={stats.series} /></section>
        <section className="card p-4 sm:p-5">
          <h2 className="section-title">Facility performance</h2>
          <p className="mb-4 mt-1 text-sm text-slate-600">{busiest.open > 0 ? `${busiest.name} has ${busiest.open} open, the most of any facility.` : 'No facilities have open concerns.'}</p>
          <ul className="space-y-4">{stats.facilities.map((facility) => {
            const rate = percentage(facility.done, facility.total)
            return <li key={facility.name} className="text-sm"><div className="flex flex-wrap justify-between gap-x-2"><strong>{facility.name}</strong><span className="text-slate-600">{facility.total ? `${rate}% completed · ${facility.open} open` : 'No reports'}</span></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true"><div className="h-full rounded-full bg-brand" style={{ width: `${rate}%` }} /></div></li>
          })}</ul>
        </section>
      </div>
      <section className="card p-4 sm:p-5">
        <h2 className="section-title">Problem categories</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {stats.categories.map((category) => <div key={category.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><h3 className="font-semibold">{category.name}</h3><dl className="mt-2 space-y-1 text-sm">{[['Reports', category.total], ['Completed', category.done], ['Average repair time', category.avgDays === null ? '—' : `${category.avgDays} d`]].map(([label, value]) => <div key={label} className="flex justify-between gap-2"><dt className="text-slate-600">{label}</dt><dd className="font-semibold">{value}</dd></div>)}</dl></div>)}
        </div>
      </section>
      <section className="card p-4 sm:p-5">
        <h2 className="section-title">Maintenance history</h2>
        <p className="mb-4 mt-1 text-sm text-slate-600">Verified repairs, newest first.</p>
        <ConcernTable rows={stats.history} empty="No repairs have been verified yet." completionDetails />
      </section>
      <ReportGenerator />
    </>
  )
}
