import Sidebar from './Sidebar.jsx'
import { useApp } from '../../context/AppContext.jsx'
export default function AppLayout({ children }) {
  const { user, setPage, myNotices } = useApp()
  const unread = myNotices.filter((n) => !n.read).length
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4 no-print">
          <input className="input max-w-sm bg-slate-50" placeholder="Search concerns, locations, or report ID" />
          <div className="flex items-center gap-4 text-xs text-slate-500">MAIN CAMPUS
            <button onClick={() => setPage('dashboard')} className="relative">🔔{unread > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-[9px] px-1">{unread}</span>}</button>
            {user.role !== 'staff' && <button className="btn" onClick={() => setPage('report')}>+ Report Concern</button>}</div>
        </header>
        <main className="p-6 space-y-5">{children}</main>
      </div>
    </div>
  )
}
