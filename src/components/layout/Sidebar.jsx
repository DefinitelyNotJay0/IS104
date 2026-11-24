import { useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import Icon from '../ui/Icon.jsx'

export const PAGE_LABELS = {
  dashboard: 'Dashboard',
  report: 'Report a Problem',
  concerns: 'Facility Concerns',
  status: 'Repair Status',
  staff: 'Staff Assignments',
  analytics: 'Analytics & History',
}
const SHOW = {
  admin: ['dashboard', 'concerns', 'status', 'staff', 'analytics'],
  user: ['dashboard', 'report', 'status'],
  staff: ['dashboard', 'status'],
}
const ROLE = { admin: 'Administrator', user: 'Student / Faculty', staff: 'Maintenance Staff' }

function SidebarContent({ onClose }) {
  const { user, page, setPage, logout } = useApp()
  return (
    <div className="flex min-h-full flex-col gap-7 p-4 text-slate-200">
      <div className="flex items-center gap-3 px-1 py-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-300 text-navy"><Icon name="tool" /></span>
        <div className="flex-1"><p className="text-lg font-bold leading-none text-white">FixTrack</p><p className="mt-1 text-xs text-slate-300">Campus facilities</p></div>
        {onClose && <button type="button" autoFocus className="icon-button hover:bg-navy-700" onClick={onClose} aria-label="Close navigation"><Icon name="close" /></button>}
      </div>
      <nav aria-label="Workspace" className="space-y-1">
        {SHOW[user.role].map((key) => (
          <button key={key} type="button" aria-current={page === key ? 'page' : undefined}
            onClick={() => { setPage(key); onClose?.() }}
            className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm ${page === key ? 'bg-teal-300/15 font-semibold text-teal-100' : 'hover:bg-navy-700'}`}>
            <Icon name={key} className="size-[18px] shrink-0" />{PAGE_LABELS[key]}
          </button>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/15 pt-4">
        <div className="flex items-center gap-3 px-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white" aria-hidden="true">{user.name.slice(0, 2).toUpperCase()}</span>
          <div className="min-w-0"><p className="text-sm font-semibold text-white">{user.name}</p><p className="text-xs text-slate-300">{user.campusRole || ROLE[user.role]}</p></div>
        </div>
        <button type="button" onClick={() => { onClose?.(); logout() }} className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm hover:bg-navy-700"><Icon name="logout" className="size-[18px]" />Sign out</button>
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  const drawer = useRef(null)
  useEffect(() => {
    const dialog = drawer.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = (event) => { if (event.matches) onClose() }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [onClose])

  return (
    <>
      <aside className="no-print sticky top-0 hidden h-dvh w-60 shrink-0 self-start overflow-y-auto bg-navy lg:block"><SidebarContent /></aside>
      <dialog id="workspace-navigation" ref={drawer} aria-label="Workspace navigation"
        onCancel={(event) => { event.preventDefault(); onClose() }}
        onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
        className="no-print fixed inset-y-0 left-0 right-auto m-0 h-dvh max-h-none w-[min(85vw,19rem)] max-w-none overflow-y-auto bg-navy text-white backdrop:bg-navy/60 lg:hidden">
        <SidebarContent onClose={onClose} />
      </dialog>
    </>
  )
}
