import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
const TYPES = {
  staff: { label: 'Staff assignment list', desc: 'Active repairs per staff member (like a class list, but for work orders)' },
  open: { label: 'Open concerns by facility', desc: 'Everything still pending or in progress' },
  history: { label: 'Completion history', desc: 'Verified completed repairs' },
}
const RANK = { Critical: 0, High: 1, Medium: 2, Low: 3 }
const FACILITIES = ['Library', 'Classrooms', 'Faculty Room', 'Computer Lab']
export default function ReportGenerator() {
  const { concerns, user } = useApp()
  const [type, setType] = useState('staff'), [filter, setFilter] = useState('All'), [out, setOut] = useState(null)
  const staffNames = [...new Set(concerns.map((c) => c.assigned).filter(Boolean))]
  const options = type === 'staff' ? staffNames : FACILITIES
  const generate = () => {
    let rows = concerns.filter((c) => (type === 'history' ? c.status === 'Completed' : c.status !== 'Completed'))
    if (type === 'staff') rows = rows.filter((c) => c.assigned && (filter === 'All' || c.assigned === filter))
    else if (filter !== 'All') rows = rows.filter((c) => c.facility === filter)
    rows = [...rows].sort((a, b) => (type === 'staff' ? (a.assigned || '').localeCompare(b.assigned || '') : 0) || RANK[a.priority] - RANK[b.priority])
    setOut({ type, filter, rows, at: new Date().toLocaleString() })
  }
  const csv = () => {
    const head = ['No', 'ID', 'Concern', 'Location', 'Category', 'Priority', 'Status', 'Assigned To']
    const body = out.rows.map((c, i) => [i + 1, c.id, c.title, `${c.facility} ${c.loc}`, c.category, c.priority, c.status, c.assigned || 'Unassigned'])
    const text = [head, ...body].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([text], { type: 'text/csv' })), download: `fixtrack-${out.type}-report.csv` })
    a.click()
  }
  return (
    <div className="card p-5 space-y-4">
      <div><b className="text-sm">System-generated reports</b><p className="text-xs text-slate-500">Choose a report, filter it, and generate a printable list from live data.</p></div>
      <div className="grid md:grid-cols-3 gap-3">{Object.entries(TYPES).map(([k, t]) => <button key={k} onClick={() => { setType(k); setFilter('All'); setOut(null) }} className={`text-left border rounded-lg p-3 ${type === k ? 'border-brand bg-brand-soft' : 'border-slate-200'}`}><b className="text-sm">{t.label}</b><p className="text-[11px] text-slate-500 mt-1">{t.desc}</p></button>)}</div>
      <div className="flex flex-wrap gap-3 items-end">
        <div><label className="label">{type === 'staff' ? 'Staff member' : 'Facility'}</label><select className="input w-52" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="All">{type === 'staff' ? 'All staff' : 'All facilities'}</option>{options.map((o) => <option key={o}>{o}</option>)}</select></div>
        <button className="btn" onClick={generate}>⚙ Generate report</button>
        {out && <><button className="btn-ghost" onClick={() => window.print()}>🖨 Print / Save PDF</button><button className="btn-ghost" onClick={csv}>⬇ Download CSV</button></>}
      </div>
      {out && (
        <div id="report-preview" className="border border-slate-300 rounded-lg p-6 bg-white text-sm">
          <div className="text-center border-b pb-3"><b className="text-lg">FixTrack · {TYPES[out.type].label}</b><p className="text-xs text-slate-500">Campus Facility Concern Management</p></div>
          <div className="flex justify-between text-xs my-3"><span>{out.type === 'staff' ? 'Staff' : 'Facility'}: <b>{out.filter === 'All' ? 'All' : out.filter}</b></span><span>Generated: {out.at}</span><span>Prepared by: <b>{user.name}</b></span></div>
          <table className="w-full text-xs border-collapse"><thead><tr className="bg-slate-100 text-left">{['No.', 'ID', 'Concern', 'Location', 'Category', 'Priority', 'Status', 'Assigned To'].map((h) => <th key={h} className="border p-2">{h}</th>)}</tr></thead>
            <tbody>{out.rows.length ? out.rows.map((c, i) => <tr key={c.id}>{[i + 1, c.id, c.title, `${c.facility} · ${c.loc}`, c.category, c.priority, c.status, c.assigned || 'Unassigned'].map((v, j) => <td key={j} className="border p-2">{v}</td>)}</tr>) : <tr><td colSpan="8" className="border p-4 text-center text-slate-400">No matching records.</td></tr>}</tbody></table>
          <p className="text-xs mt-3">Total records: <b>{out.rows.length}</b></p>
          <div className="grid grid-cols-2 gap-10 mt-10 text-xs text-center"><div className="border-t pt-1">Prepared by (Administrator)</div><div className="border-t pt-1">Noted by (Facility Head)</div></div>
        </div>
      )}
    </div>
  )
}
