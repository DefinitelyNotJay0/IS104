import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { facilities } from '../data/mock.js'
import { PRIORITY_RANK } from '../utils/helpers.js'
const TYPES = {
  staff: { label: 'Staff assignment list', desc: 'Active repairs grouped by staff member' },
  open: { label: 'Open concerns by facility', desc: 'Pending, in-progress, and unverified repairs' },
  history: { label: 'Completion history', desc: 'Verified completed repairs' },
}

export default function ReportGenerator() {
  const { concerns, user } = useApp()
  const [type, setType] = useState('staff'), [filter, setFilter] = useState('All'), [out, setOut] = useState(null)
  const staffNames = [...new Set(concerns.map((c) => c.assigned).filter(Boolean))]
  const options = type === 'staff' ? staffNames : facilities.map(({ name }) => name)
  const generate = () => {
    let rows = concerns.filter((c) => (type === 'history' ? c.status === 'Completed' : c.status !== 'Completed'))
    if (type === 'staff') rows = rows.filter((c) => c.assigned && (filter === 'All' || c.assigned === filter))
    else if (filter !== 'All') rows = rows.filter((c) => c.facility === filter)
    rows.sort((a, b) => {
      if (type === 'history') return (b.doneAt || 0) - (a.doneAt || 0)
      return (type === 'staff' ? a.assigned.localeCompare(b.assigned) : 0) || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
    })
    setOut({ type, filter, rows, at: new Date().toLocaleString() })
  }
  const csv = () => {
    const head = ['No', 'ID', 'Concern', 'Location', 'Category', 'Priority', 'Status', 'Assigned To']
    const body = out.rows.map((c, i) => [i + 1, c.id, c.title, `${c.facility} ${c.loc}`, c.category, c.priority, c.status, c.assigned || 'Unassigned'])
    const text = [head, ...body].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
    const link = Object.assign(document.createElement('a'), { href: url, download: `fixtrack-${out.type}-report.csv` })
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div className="card space-y-4 p-4 sm:p-5">
      <div><h2 className="section-title">Export reports</h2><p className="mt-1 text-sm text-slate-600">Generate a report to print, save as a PDF, or download as CSV.</p></div>
      <div className="grid gap-3 md:grid-cols-3" role="group" aria-label="Report type">{Object.entries(TYPES).map(([k, t]) => <button key={k} type="button" aria-pressed={type === k} onClick={() => { setType(k); setFilter('All'); setOut(null) }} className={`text-left border rounded-lg p-3 ${type === k ? 'border-brand bg-brand-soft' : 'border-slate-200'}`}><b className="text-sm">{t.label}</b><p className="text-[11px] text-slate-500 mt-1">{t.desc}</p></button>)}</div>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-full sm:w-auto"><label className="label" htmlFor="export-filter">{type === 'staff' ? 'Staff member' : 'Facility'}</label><select id="export-filter" className="input sm:w-52" value={filter} onChange={(e) => { setFilter(e.target.value); setOut(null) }}><option value="All">{type === 'staff' ? 'All staff' : 'All facilities'}</option>{options.map((o) => <option key={o}>{o}</option>)}</select></div>
        <button className="btn" onClick={generate}>Generate report</button>
        {out && <><button className="btn-ghost" onClick={() => window.print()}>Print / Save PDF</button><button className="btn-ghost" onClick={csv}>Download CSV</button></>}
      </div>
      {out && (
        <div id="report-preview" className="border border-slate-300 rounded-lg p-4 sm:p-6 bg-white text-sm">
          <div className="text-center border-b pb-3"><b className="text-lg">FixTrack · {TYPES[out.type].label}</b><p className="text-xs text-slate-500">Campus Facility Concern Management</p></div>
          <div className="my-3 flex flex-wrap justify-between gap-2 text-xs"><span>{out.type === 'staff' ? 'Staff' : 'Facility'}: <b>{out.filter === 'All' ? 'All' : out.filter}</b></span><span>Generated: {out.at}</span><span>Prepared by: <b>{user.name}</b></span></div>
          <p className="no-print mb-2 text-xs text-slate-600 sm:hidden">Scroll the preview sideways to see all columns.</p><div className="report-table overflow-x-auto" tabIndex={0} role="region" aria-label="Report preview table"><table className="w-full min-w-[640px] text-xs border-collapse"><thead><tr className="bg-slate-100 text-left">{['No.', 'ID', 'Concern', 'Location', 'Category', 'Priority', 'Status', 'Assigned To'].map((h) => <th key={h} className="border p-2">{h}</th>)}</tr></thead>
            <tbody>{out.rows.length ? out.rows.map((c, i) => <tr key={c.id}>{[i + 1, c.id, c.title, `${c.facility} · ${c.loc}`, c.category, c.priority, c.status, c.assigned || 'Unassigned'].map((v, j) => <td key={j} className="border p-2">{v}</td>)}</tr>) : <tr><td colSpan="8" className="border p-4 text-center text-slate-400">No matching records.</td></tr>}</tbody></table></div>
          <p className="text-xs mt-3">Total records: <b>{out.rows.length}</b></p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-center text-xs sm:gap-10"><div className="border-t pt-1">Prepared by (Administrator)</div><div className="border-t pt-1">Noted by (Facility Head)</div></div>
        </div>
      )}
    </div>
  )
}
