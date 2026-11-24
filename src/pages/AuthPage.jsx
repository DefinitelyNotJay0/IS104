import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { staff } from '../data/mock.js'
import Icon from '../components/ui/Icon.jsx'

export default function AuthPage() {
  const { login } = useApp()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ first: '', last: '', email: '', role: 'Student', password: '', confirmation: '' })
  const [error, setError] = useState('')
  const register = tab === 'register'
  const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(form.password)
  const update = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
    setError('')
  }
  const submit = (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    if (!register) {
      const match = email.match(/^staff(\d)/)
      const member = match ? staff[+match[1] - 1] : email.startsWith('staff') ? staff[1] : null
      return login(email.startsWith('admin') ? { name: 'Emily Rivera', role: 'admin' } : member ? { name: member.name, role: 'staff' } : { name: 'Maya Chen', role: 'user' })
    }
    if (!email.endsWith('@school.edu')) return setError('Enter your @school.edu email address.')
    if (!strong) return setError('Choose a password with at least 8 characters, an uppercase letter, a number, and a symbol.')
    if (form.password !== form.confirmation) return setError('The passwords must match.')
    if (!form.first.trim() || !form.last.trim()) return setError('Enter your first and last name.')
    login({ name: `${form.first.trim()} ${form.last.trim()}`, role: 'user', campusRole: form.role })
  }

  return (
    <main className="min-h-dvh bg-[#f4f7fa] lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
      <div className="flex flex-col justify-between gap-7 overflow-hidden bg-navy px-5 py-7 text-white sm:px-10 lg:min-h-dvh lg:px-12 lg:py-12 xl:px-16">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-teal-300 text-navy"><Icon name="tool" /></span><p className="text-xl font-bold">FixTrack</p></div>
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl xl:text-6xl">Campus facility repairs</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-200 sm:text-base">Report facility problems, track repair progress, and manage maintenance assignments.</p>
          <div className="mt-8 hidden gap-3 lg:grid">
            {[['report', 'Report a facility concern'], ['status', 'Follow repair progress'], ['staff', 'Coordinate maintenance']].map(([icon, label]) => <div key={icon} className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-3 text-sm"><Icon name={icon} className="size-5 text-teal-300" />{label}</div>)}
          </div>
        </div>
        <div aria-hidden="true" className="hidden w-12 border-t-4 border-teal-300 lg:block" />
      </div>
      <div className="grid min-w-0 place-items-center px-4 py-6 sm:px-8 sm:py-10">
        <form onSubmit={submit} className="card w-full max-w-lg space-y-4 p-4 sm:p-7">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1" role="group" aria-label="Account access">
            {['login', 'register'].map((mode) => <button key={mode} type="button" aria-pressed={tab === mode} onClick={() => { setTab(mode); setError('') }} className={`min-h-11 rounded-lg px-2 text-sm font-semibold ${tab === mode ? 'bg-white text-brand-dark shadow-sm' : 'text-slate-600'}`}>{mode === 'login' ? 'Log in' : 'Register'}</button>)}
          </div>
          <h2 className="page-title">{register ? 'Create an account' : 'Log in to FixTrack'}</h2>
          {register && <div className="grid gap-3 min-[360px]:grid-cols-2">
            <div><label className="label" htmlFor="first-name">First name</label><input id="first-name" className="input" autoComplete="given-name" required value={form.first} onChange={update('first')} /></div>
            <div><label className="label" htmlFor="last-name">Last name</label><input id="last-name" className="input" autoComplete="family-name" required value={form.last} onChange={update('last')} /></div>
          </div>}
          <div><label className="label" htmlFor="school-email">School email</label><input id="school-email" type="email" required autoComplete="username" className="input" placeholder="maya.chen@school.edu" value={form.email} onChange={update('email')} /></div>
          {register && <div><label className="label" htmlFor="account-role">Campus role</label><select id="account-role" className="input" value={form.role} onChange={update('role')}><option>Student</option><option>Faculty</option></select></div>}
          <div><label className="label" htmlFor="account-password">Password</label><input id="account-password" type="password" autoComplete={register ? 'new-password' : 'current-password'} required={register} aria-describedby={register ? 'password-help' : undefined} className="input" value={form.password} onChange={update('password')} />
            {register && <p id="password-help" className="mt-1 text-xs text-slate-600">Use 8 or more characters, with an uppercase letter, a number, and a symbol.</p>}
          </div>
          {register && <div><label className="label" htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" autoComplete="new-password" required className="input" value={form.confirmation} onChange={update('confirmation')} /></div>}
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <button className="btn w-full" type="submit">{register ? 'Create account' : 'Log in'}</button>
          {!register && <div className="rounded-xl bg-brand-soft p-3 text-sm text-brand-dark"><p className="font-semibold">Demo access</p><p className="mt-1 text-xs leading-relaxed">Use admin@school.edu for the administrator, staff1–staff3@school.edu for maintenance, or maya.chen@school.edu for student access. The demo accepts any password, including a blank one.</p></div>}
        </form>
      </div>
    </main>
  )
}
