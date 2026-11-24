import { useCallback, useEffect, useRef, useState } from 'react'
import Sidebar, { PAGE_LABELS } from './Sidebar.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { fmt } from '../../utils/helpers.js'
import Icon from '../ui/Icon.jsx'

export default function AppLayout({ children }) {
  const { user, page, setPage, myNotices, markRead, open } = useApp()
  const [menu, setMenu] = useState(false)
  const [updates, setUpdates] = useState(false)
  const notificationArea = useRef(null)
  const notificationButton = useRef(null)
  const closeMenu = useCallback(() => setMenu(false), [])
  const unread = myNotices.filter((notice) => !notice.read).length

  useEffect(() => { window.scrollTo(0, 0) }, [page])
  useEffect(() => {
    if (!updates) return
    const dismissOutside = (event) => {
      if (!notificationArea.current?.contains(event.target)) setUpdates(false)
    }
    const dismissWithEscape = (event) => {
      if (event.key !== 'Escape') return
      setUpdates(false)
      notificationButton.current?.focus()
    }
    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('keydown', dismissWithEscape)
    return () => {
      document.removeEventListener('pointerdown', dismissOutside)
      document.removeEventListener('keydown', dismissWithEscape)
    }
  }, [updates])

  return (
    <div className="flex min-h-dvh">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">Skip to content</a>
      <Sidebar open={menu} onClose={closeMenu} />
      <div className="min-w-0 flex-1">
        <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="relative mx-auto flex min-h-16 max-w-[100rem] items-center gap-2 px-3 sm:gap-4 sm:px-6 xl:px-8">
            <button type="button" className="icon-button lg:hidden" onClick={() => { setUpdates(false); setMenu(true) }} aria-label="Open navigation" aria-expanded={menu} aria-controls="workspace-navigation"><Icon name="menu" /></button>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{PAGE_LABELS[page]}</span>
            <div className="shrink-0" ref={notificationArea}>
              <button ref={notificationButton} type="button" className="icon-button relative" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} aria-expanded={updates} aria-controls="workspace-updates" onClick={() => setUpdates(!updates)}>
                <Icon name="bell" />
                {unread > 0 && <span aria-hidden="true" className="absolute right-1 top-1 min-w-4 rounded-full bg-brand-dark px-1 text-center text-[10px] font-bold text-white">{unread > 99 ? '99+' : unread}</span>}
              </button>
              {updates && <section id="workspace-updates" aria-label="Notifications" className="card absolute inset-x-3 top-full mt-2 sm:inset-x-auto sm:right-6 sm:w-96">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-1">
                  <h2 className="section-title">Notifications</h2>
                  {unread > 0 && <button type="button" className="min-h-11 text-sm font-semibold text-brand-dark" onClick={() => { markRead(); notificationButton.current?.focus() }}>Mark all read</button>}
                </div>
                <ul className="max-h-[min(55dvh,24rem)] divide-y divide-slate-100 overflow-y-auto">
                  {myNotices.map((notice) => <li key={notice.id}><button type="button" className={`w-full px-4 py-3 text-left text-sm hover:bg-slate-50 ${notice.read ? 'text-slate-600' : 'font-semibold'}`} onClick={() => { open(notice.ref); setUpdates(false); notificationButton.current?.focus() }}><p>{notice.text}</p><span className="mt-1 block text-xs font-normal text-slate-600">{notice.ref} · {fmt(notice.at)}</span></button></li>)}
                  {!myNotices.length && <li className="p-4 text-sm text-slate-600">No notifications yet.</li>}
                </ul>
              </section>}
            </div>
            {user.role === 'user' && page !== 'report' && <button type="button" className="btn shrink-0 px-3 sm:px-4" onClick={() => { setUpdates(false); setPage('report') }}><Icon name="report" className="size-4" /><span className="sm:hidden">Report</span><span className="hidden sm:inline">Report a problem</span></button>}
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="mx-auto max-w-[100rem] scroll-mt-16 space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-7 xl:px-8">{children}</main>
      </div>
    </div>
  )
}
