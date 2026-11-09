import Badge from './ui/Badge.jsx'
import { useApp } from '../context/AppContext.jsx'
export default function ConcernTable({ rows }) {
  const { user, open, setReviewing } = useApp()
  const label = (c) => (user.role === 'admin' && c.status === 'Pending' ? 'Review' : user.role === 'admin' && c.status === 'For Verification' ? 'Verify' : user.role === 'staff' && c.status === 'In Progress' ? 'Update' : 'View →')
  const act = (c) => (user.role === 'admin' && c.status === 'Pending' ? setReviewing(c) : open(c.id))
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase text-slate-400 text-left"><tr><th className="py-2 px-3">Concern / Location</th><th>Category</th><th>Priority</th><th>Status</th><th>Assigned to</th><th></th></tr></thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-t border-slate-100 hover:bg-brand-soft/50">
              <td className="py-3 px-3"><span className="text-brand text-[10px] font-bold">{c.id}</span> <b>{c.title}</b><div className="text-[11px] text-slate-400">{c.facility} · {c.loc}</div></td>
              <td>{c.category}</td><td><Badge value={c.priority} /></td><td><Badge value={c.status} /></td>
              <td className="text-slate-500">{c.assigned || 'Unassigned'}</td>
              <td><button onClick={() => act(c)} className="text-brand font-semibold text-xs">{label(c)}</button></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="6" className="p-6 text-center text-xs text-slate-400">Nothing here yet.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
