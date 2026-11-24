import Badge from './ui/Badge.jsx'
import { useApp } from '../context/AppContext.jsx'
import { fmt, HR } from '../utils/helpers.js'

export default function ConcernTable({ rows, empty = 'No concerns to show.', completionDetails = false }) {
  const { user, open, setReviewing } = useApp()
  const action = (c) => {
    if (user.role === 'admin' && c.status === 'Pending') return ['Review', () => setReviewing(c)]
    if (user.role === 'admin' && c.status === 'For Verification') return ['Verify', () => open(c.id)]
    if (user.role === 'staff' && c.status === 'In Progress') return ['Update', () => open(c.id)]
    return ['View', () => open(c.id)]
  }
  const actionButton = (c) => {
    const [label, onClick] = action(c)
    return <button type="button" onClick={onClick} aria-label={`${label} ${c.id}`} className="min-h-11 rounded-lg px-2 text-sm font-semibold text-brand-dark hover:bg-brand-soft">{label} <span aria-hidden="true">→</span></button>
  }
  const timing = (c) => [
    c.doneAt ? fmt(c.doneAt) : '—',
    c.assignedAt ? `${Math.round((c.assignedAt - c.createdAt) / HR * 10) / 10} h response` : '—',
    c.doneAt ? `${Math.round((c.doneAt - c.createdAt) / HR * 10) / 10} h to complete` : '—',
  ].join(' · ')

  if (!rows.length) return <p className="rounded-xl bg-slate-50 px-4 py-7 text-center text-sm text-slate-600">{empty}</p>

  return (
    <div className="[container-type:inline-size]">
      <ul className={`records-cards space-y-3 ${completionDetails ? 'history-cards' : ''}`}>
        {rows.map((c) => (
          <li key={c.id} className="rounded-xl border border-slate-200 p-3 sm:p-4">
            <p className="text-xs font-semibold text-brand-dark">{c.id}</p>
            <h3 className="mt-1 text-sm font-bold">{c.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{c.facility} · {c.loc}</p>
            <div className="mt-3 flex flex-wrap gap-2"><Badge value={c.priority} /><Badge value={c.status} /></div>
            {completionDetails && <p className="mt-2 text-xs text-slate-600">{timing(c)}</p>}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3">
              <p className="text-xs text-slate-600">{c.category} · {c.assigned || 'Unassigned'}</p>
              {actionButton(c)}
            </div>
          </li>
        ))}
      </ul>
      <div className={`records-table hidden ${completionDetails ? 'history-table' : ''}`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
            <tr>{['Concern / location', 'Category', 'Priority', 'Status', 'Assigned to', ...(completionDetails ? ['Completion'] : []), 'Action'].map((header) => <th key={header} scope="col" className="px-3 py-3">{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="w-[34%] px-3 py-3"><span className="text-xs font-semibold text-brand-dark">{c.id}</span><p className="font-semibold">{c.title}</p><p className="text-xs text-slate-600">{c.facility} · {c.loc}</p></td>
                <td className="px-3 py-2">{c.category}</td>
                <td className="px-3 py-2"><Badge value={c.priority} /></td>
                <td className="px-3 py-2"><Badge value={c.status} /></td>
                <td className="px-3 py-2 text-slate-600">{c.assigned || 'Unassigned'}</td>
                {completionDetails && <td className="px-3 py-2 text-xs text-slate-600">{timing(c)}</td>}
                <td className="px-2 py-2">{actionButton(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
