import { useApp } from '../../context/AppContext.jsx'
const ALL = [['dashboard', 'Dashboard'], ['report', 'Report a Problem'], ['concerns', 'Facility Concerns'], ['status', 'Repair Status'], ['staff', 'Staff Assignments'], ['analytics', 'Analytics & History']]
const SHOW = { admin: ALL.map((a) => a[0]), user: ['dashboard', 'report', 'status'], staff: ['dashboard', 'status'] }
const ROLE = { admin: 'Admin', user: 'Student/Faculty', staff: 'Maintenance Staff' }
export default function Sidebar() {
  const { user, page, setPage, logout } = useApp()
  const items = ALL.filter(([k]) => SHOW[user.role].includes(k))
  return (
    <aside className="w-56 shrink-0 bg-navy text-slate-300 flex flex-col min-h-screen p-3 no-print">
      <div className="px-2 py-3"><b className="text-white text-lg">🔧 FixTrack</b><p className="text-[9px] tracking-wider">CAMPUS FACILITY MANAGEMENT</p></div>
      <p className="text-[10px] px-2 mt-4 mb-1 text-slate-500">WORKSPACE</p>
      <nav className="space-y-1">{items.map(([k, l]) => <button key={k} onClick={() => setPage(k)} className={`w-full text-left text-sm px-3 py-2 rounded-lg ${page === k ? 'bg-brand text-white font-semibold' : 'hover:bg-navy-700'}`}>{l}</button>)}</nav>
      <div className="mt-4 mx-1 p-3 rounded-lg bg-navy-700 text-xs"><b className="text-white">A better campus, together.</b><p className="mt-1">Prioritize concerns and keep every repair moving.</p></div>
      <button onClick={logout} className="mt-auto flex items-center gap-2 px-2 py-3 border-t border-navy-700 text-left">
        <span className="w-8 h-8 rounded-full bg-brand/30 grid place-items-center text-xs text-white">{user.name.slice(0, 2).toUpperCase()}</span>
        <span className="text-xs"><b className="text-white block">{user.name}</b>{ROLE[user.role]} · sign out</span>
      </button>
    </aside>
  )
}
