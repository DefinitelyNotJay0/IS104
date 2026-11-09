import { useApp } from '../context/AppContext.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import ConcernTable from '../components/ConcernTable.jsx'
import { facilities } from '../data/mock.js'
import { fmt } from '../utils/helpers.js'
export default function Dashboard() {
  const { user, concerns, setPage, open, myNotices, markRead } = useApp()
  const role = user.role
  const rows = role === 'admin' ? concerns : role === 'staff' ? concerns.filter((c) => c.assigned === user.name) : concerns.filter((c) => c.reporter === user.name)
  const n = (s) => rows.filter((c) => c.status === s).length
  const toVerify = concerns.filter((c) => c.status === 'For Verification').length
  const stats = role === 'admin' ? [['Total Reports', 48, 'Across 4 campus facilities'], ['Pending', 14, 'Awaiting review or assignment'], ['In Progress', 9, 'Assigned and actively repairing'], ['Completed', 25, '52.1% of all reports resolved']]
    : role === 'staff' ? [['Assigned to me', rows.length, 'All my repair tasks'], ['In Progress', n('In Progress'), 'Repairs I am working on'], ['For Verification', n('For Verification'), 'Waiting for admin check'], ['Completed', n('Completed'), 'Verified repairs']]
    : [['My reports', rows.length, 'Your concerns, all in one place'], ['Pending', n('Pending'), 'Awaiting administrator review'], ['In Progress', n('In Progress') + n('For Verification'), 'A repair is underway'], ['Completed', n('Completed'), 'Thanks for making campus better']]
  const head = { admin: ['CAMPUS OPERATIONS', 'Campus at a glance'], staff: ['MY REPAIR TASKS', `Hi ${user.name.split(' ')[0]}, here are your repairs.`], user: ['YOUR CAMPUS WORKSPACE', `Hi ${user.name.split(' ')[0]}, let’s care for our campus.`] }[role]
  return (
    <>
      <div><p className="text-[10px] font-bold text-brand">{head[0]}</p><h1 className="text-2xl font-bold">{head[1]}</h1></div>
      {role === 'admin' && toVerify > 0 && <div className="bg-violet-50 text-violet-700 text-xs rounded-lg px-4 py-2 flex justify-between">{toVerify} finished repair{toVerify > 1 ? 's' : ''} waiting for your verification.<button onClick={() => setPage('concerns')} className="font-bold">Open queue →</button></div>}
      {role === 'admin' && <div className="bg-red-50 text-red-600 text-xs rounded-lg px-4 py-2 flex justify-between">{concerns.filter((c) => c.status === 'Pending' && ['High', 'Critical'].includes(c.priority)).length} high-priority concern(s) still need review.<button onClick={() => setPage('concerns')} className="font-bold">Review queue →</button></div>}
      {role === 'user' && <div className="bg-navy text-white rounded-xl p-5 flex justify-between items-center"><div><b>See something that needs fixing?</b><p className="text-xs text-slate-300">A clear report helps the right team get to the right place, faster.</p></div><button className="btn" onClick={() => setPage('report')}>+ Report a problem</button></div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{stats.map(([l, v, nt]) => <StatCard key={l} label={l} value={v} note={nt} />)}</div>
      {role === 'admin' && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card p-5"><b className="text-sm">Reports by Status</b>
            <div className="flex items-center gap-8 mt-4"><div className="w-36 h-36 rounded-full grid place-items-center" style={{ background: 'conic-gradient(#15803d 0 52%, #d6a02a 52% 81%, #3b6bb5 81% 100%)' }}><div className="w-24 h-24 bg-white rounded-full grid place-items-center text-center"><span className="text-2xl font-bold">48<br /><small className="text-[9px] font-normal text-slate-400">total reports</small></span></div></div>
              <ul className="text-sm space-y-2"><li>● Completed 25</li><li>● Pending 14</li><li>● In Progress 9</li></ul></div></div>
          <div className="card p-5"><b className="text-sm">Reports by Facility</b>
            <div className="space-y-3 mt-4">{facilities.map((f) => <div key={f.name} className="text-xs"><div className="flex justify-between"><span>{f.name}</span><span>{f.total}</span></div><div className="h-2 bg-slate-100 rounded"><div className="h-2 bg-brand rounded" style={{ width: `${(f.total / 16) * 100}%` }} /></div></div>)}</div></div>
        </div>
      )}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="card p-4"><b className="text-sm px-3">{role === 'admin' ? 'Priority-ranked concern queue' : role === 'staff' ? 'My assigned repairs' : 'My reports'}</b><ConcernTable rows={rows.slice(0, 5)} /></div>
        <div className="card p-4"><div className="flex justify-between"><b className="text-sm">Latest updates</b><button onClick={markRead} className="text-xs text-brand font-semibold">Mark read</button></div>
          <ul className="mt-3 space-y-3">{myNotices.slice(0, 5).map((x) => <li key={x.id}><button onClick={() => open(x.ref)} className="text-left text-xs"><span className={x.read ? 'text-slate-500' : 'font-bold'}>{x.text}</span><span className="block text-[10px] text-slate-400">{x.ref} · {fmt(x.at)}</span></button></li>)}{!myNotices.length && <li className="text-xs text-slate-400">No updates yet.</li>}</ul></div>
      </div>
    </>
  )
}
