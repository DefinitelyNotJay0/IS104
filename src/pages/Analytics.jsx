import StatCard from '../components/ui/StatCard.jsx'
import TrendChart from '../components/ui/TrendChart.jsx'
import Badge from '../components/ui/Badge.jsx'
import ReportGenerator from '../components/ReportGenerator.jsx'
import { useApp } from '../context/AppContext.jsx'
import { weekly, facilities, categories, staff } from '../data/mock.js'
import { summarize } from '../utils/analytics.js'
import { fmt, workload } from '../utils/helpers.js'
const TONE = { bad: 'border-red-300 bg-red-50', warn: 'border-amber-300 bg-amber-50', info: 'border-blue-200 bg-blue-50', good: 'border-emerald-300 bg-emerald-50' }
const ICON = { bad: '🔴', warn: '🟠', info: '🔵', good: '🟢' }
const pct = (a, b) => Math.round((a / b) * 100)
export default function Analytics() {
  const { concerns } = useApp()
  const s = summarize({ concerns, weekly, facilities, categories, staff: staff.map((m) => ({ ...m, active: workload(concerns, m.name) })) })
  const log = concerns.filter((c) => c.status === 'Completed').sort((a, b) => b.doneAt - a.doneAt)
  return (
    <>
      <div><p className="text-[10px] font-bold text-brand">CAMPUS OPERATIONS</p><h1 className="text-2xl font-bold">Insights that improve campus care.</h1><p className="text-xs text-slate-500">Reporting period Oct 1 – 16, 2026 · analysis is computed automatically from report data.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><StatCard label="Total Reports" value={s.total} note={`${s.open} still open`} /><StatCard label="Completion rate" value={`${s.rate}%`} note={`${s.done} completed out of ${s.total}`} /><StatCard label="Avg. response time" value={`${s.responseHrs} hrs`} note="Report → assigned to staff" /><StatCard label="Avg. completion time" value={`${s.completionHrs} hrs`} note="Report → verified completed" /></div>

      <div className="card p-5"><b className="text-sm">What the data says</b><p className="text-xs text-slate-500 mb-3">Auto-generated findings and recommended actions.</p>
        <div className="grid md:grid-cols-2 gap-3">{s.insights.map((i) => <div key={i.title} className={`border rounded-lg p-3 ${TONE[i.tone]}`}><p className="text-sm font-bold">{ICON[i.tone]} {i.title}</p><p className="text-xs text-slate-600 mt-1">{i.detail}</p><p className="text-xs mt-2"><b>Recommended:</b> {i.action}</p></div>)}</div></div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="card p-5"><b className="text-sm">Are we keeping up with reports?</b><p className="text-xs text-slate-500 mb-3">Running totals. The wider the red gap, the bigger the backlog.</p><TrendChart data={s.series} /></div>
        <div className="card p-5"><b className="text-sm">Facility performance</b><p className="text-xs text-slate-500 mb-3">Share of reports already completed.</p>
          <div className="space-y-4">{facilities.map((f) => { const p = pct(f.done, f.total); return <div key={f.name} className="text-xs"><div className="flex justify-between"><b>{f.name}</b><span>{p}% · {f.total - f.done} open</span></div><div className="h-2 bg-slate-100 rounded mt-1"><div className={`h-2 rounded ${p >= 60 ? 'bg-emerald-600' : p >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${p}%` }} /></div></div> })}</div></div>
      </div>

      <div className="card p-5"><b className="text-sm">Problem categories</b><p className="text-xs text-slate-500 mb-3">Which problems are most common, and which take longest to fix.</p>
        <table className="w-full text-sm"><thead className="text-[10px] uppercase text-slate-400 text-left"><tr><th className="py-2">Category</th><th>Reports</th><th>Share</th><th>Completed</th><th>Avg. repair time</th></tr></thead>
          <tbody>{[...categories].sort((a, b) => b.total - a.total).map((c) => <tr key={c.name} className="border-t"><td className="py-2 font-semibold">{c.name}</td><td>{c.total}</td><td className="w-48"><div className="flex items-center gap-2"><div className="h-2 bg-slate-100 rounded flex-1"><div className="h-2 bg-brand rounded" style={{ width: `${pct(c.total, s.total)}%` }} /></div><span className="text-xs">{pct(c.total, s.total)}%</span></div></td><td>{pct(c.done, c.total)}%</td><td className={c.avgDays > 2 ? 'text-red-600 font-bold' : ''}>{c.avgDays} days</td></tr>)}</tbody></table></div>

      <div className="card p-5"><b className="text-sm">Maintenance history log</b><p className="text-xs text-slate-500 mb-3">Verified repairs, newest first.</p>
        <table className="w-full text-sm"><thead className="text-[10px] uppercase text-slate-400 text-left"><tr><th className="py-2">Concern</th><th>Completed by</th><th>Completed on</th><th>Response</th><th>Time to complete</th><th>Status</th></tr></thead>
          <tbody>{log.map((c) => <tr key={c.id} className="border-t"><td className="py-2"><span className="text-brand text-[10px] font-bold">{c.id}</span> <b>{c.title}</b><div className="text-[11px] text-slate-400">{c.facility} · {c.loc}</div></td><td>{c.assigned}</td><td>{fmt(c.doneAt)}</td><td>{Math.round((c.assignedAt - c.createdAt) / 360000) / 10} hrs</td><td>{Math.round((c.doneAt - c.createdAt) / 360000) / 10} hrs</td><td><Badge value="Completed" /></td></tr>)}</tbody></table></div>

      <ReportGenerator />
    </>
  )
}
