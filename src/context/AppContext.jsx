import { createContext, useContext, useState } from 'react'
import { concerns as seed, notices as seedNotices } from '../data/mock.js'
const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)
const ev = (title, desc) => ({ title, desc, at: Date.now() })
export function AppProvider({ children }) {
  const [user, setUser] = useState(null) // { name, role: 'admin' | 'staff' | 'user' }
  const [page, setPage] = useState('dashboard')
  const [concerns, setConcerns] = useState(seed)
  const [notices, setNotices] = useState(seedNotices)
  const [reviewing, setReviewing] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const patch = (id, fn) => setConcerns((l) => l.map((c) => (c.id === id ? fn(c) : c)))
  const notify = (to, text, ref) => setNotices((n) => [{ id: Date.now() + Math.random(), to, text, ref, at: Date.now(), read: false }, ...n])
  const isMine = (n) => user && (n.to === user.name || n.to === user.role)
  const myNotices = user ? notices.filter(isMine) : []
  const login = (u) => { setUser(u); setPage('dashboard') }
  const logout = () => setUser(null)
  const open = (id) => { setSelectedId(id); setPage('status') }

  // Scope 1: user files a detailed report (location, description, photo)
  const addConcern = (c) => {
    const id = `FT-${1049 + concerns.length - 7}`
    setConcerns((l) => [{ ...c, id, status: 'Pending', assigned: null, reporter: user.name, createdAt: Date.now(), progress: 0, log: [ev('Concern reported', `${user.name} reported: ${c.title}.`)] }, ...l])
    notify('admin', `New concern ${id}: ${c.title}`, id)
    notify(user.name, `We received your report ${id}. An administrator will review it.`, id)
  }
  // Scope 2 + 3: admin sets severity & urgency -> priority, then routes to maintenance personnel
  const assignConcern = (id, { priority, severity, urg, staffName, note }) => {
    const c = concerns.find((x) => x.id === id)
    patch(id, (c) => ({ ...c, priority, severity, urg, assigned: staffName, status: 'In Progress', assignedAt: Date.now(), progress: 0, reviewNote: note, log: [...c.log, ev('Reviewed, prioritized & assigned', `Priority ${priority} (severity ${severity} × urgency ${urg}). Assigned to ${staffName}. ${note}`)] }))
    notify(staffName, `${id} was assigned to you: ${c.title}`, id)
    notify(c.reporter, `Your concern ${id} was reviewed (priority ${priority}) and assigned for repair.`, id)
  }
  // Scope 3: after each repair session, staff reports to the administrator (updates repair status)
  const submitRepairReport = (id, { note, progress, done }) => {
    patch(id, (c) => ({ ...c, progress: done ? 100 : progress, status: done ? 'For Verification' : 'In Progress', log: [...c.log, ev(done ? 'Repair finished · awaiting verification' : 'Repair session report', note || 'No notes.')] }))
    if (done) notify('admin', `${id} repair finished by ${user.name}. Please verify.`, id)
  }
  // Scope 4: admin verifies completion first, then gives feedback to the reporting user
  const verifyConcern = (id, feedback) => {
    const c = concerns.find((x) => x.id === id)
    patch(id, (c) => ({ ...c, status: 'Completed', progress: 100, doneAt: Date.now(), log: [...c.log, ev('Verified & completed', feedback)] }))
    notify(c.reporter, `Your concern ${id} was verified as resolved. ${feedback}`, id)
  }
  const confirmResolved = (id) => patch(id, (c) => ({ ...c, confirmed: true, log: [...c.log, ev('Reporter confirmed', 'The reporting user confirmed the concern is resolved.')] }))
  const markRead = () => setNotices((n) => n.map((x) => (isMine(x) ? { ...x, read: true } : x)))
  return <Ctx.Provider value={{ user, login, logout, page, setPage, concerns, addConcern, assignConcern, submitRepairReport, verifyConcern, confirmResolved, reviewing, setReviewing, selectedId, setSelectedId, open, myNotices, markRead }}>{children}</Ctx.Provider>
}
