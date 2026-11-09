import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { staff } from '../data/mock.js'
export default function AuthPage() {
  const { login } = useApp()
  const [tab, setTab] = useState('login')
  const [f, setF] = useState({ first: '', last: '', email: '', role: 'Student', pw: '', pw2: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const emailBad = tab === 'register' && f.email && !f.email.endsWith('@school.edu')
  const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(f.pw)
  const submit = (e) => {
    e.preventDefault()
    if (tab === 'login') {
      const e = f.email.toLowerCase(), m = e.match(/^staff(\d)/), s = m ? staff[+m[1] - 1] : e.startsWith('staff') ? staff[1] : null
      return login(e.startsWith('admin') ? { name: 'Emily Rivera', role: 'admin' } : s ? { name: s.name, role: 'staff' } : { name: 'Maya Chen', role: 'user' })
    }
    if (!emailBad && f.email && strong && f.pw === f.pw2) login({ name: `${f.first} ${f.last}`.trim() || 'New User', role: 'user' })
  }
  return (
    <div className="min-h-screen grid md:grid-cols-[42%_58%]">
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-navy to-brand-dark text-white p-12">
        <b className="text-lg mb-16">🔧 FixTrack</b>
        <span className="text-[10px] bg-white/10 rounded px-2 py-1 w-fit mb-4">ONE CAMPUS. ONE CONNECTED WORKSPACE.</span>
        <h1 className="text-4xl font-bold leading-tight">Better spaces.<br />Better campus life.</h1>
        <p className="text-sm text-slate-300 mt-4 max-w-sm">From the first report to the final repair, keep our campus safe, functional, and ready for learning.</p>
      </div>
      <form onSubmit={submit} className="bg-white p-8 md:p-16 flex flex-col justify-center gap-3 max-w-xl w-full mx-auto">
        <div className="grid grid-cols-2 bg-slate-100 rounded-lg p-1 text-sm font-semibold">
          {['login', 'register'].map((t) => <button type="button" key={t} onClick={() => setTab(t)} className={`py-2 rounded-md capitalize ${tab === t ? 'bg-white text-brand shadow' : 'text-slate-500'}`}>{t === 'login' ? 'Log in' : 'Register'}</button>)}
        </div>
        <h2 className="text-2xl font-bold mt-3">{tab === 'login' ? 'Welcome back.' : 'Join your campus community.'}</h2>
        {tab === 'register' && <div className="grid grid-cols-2 gap-3"><div><label className="label">First name</label><input className="input" value={f.first} onChange={set('first')} /></div><div><label className="label">Last name</label><input className="input" value={f.last} onChange={set('last')} /></div></div>}
        <div><label className="label">School email</label><input className={`input ${emailBad ? 'border-red-400' : ''}`} placeholder="maya.chen@school.edu" value={f.email} onChange={set('email')} />{emailBad ? <p className="text-[11px] text-red-600 mt-1">Use an @school.edu email address to register.</p> : <p className="text-[11px] text-slate-400 mt-1">Demo: admin@… = Admin · staff1/2/3@… = Maintenance Staff · anything else = Student/Faculty.</p>}</div>
        {tab === 'register' && <div><label className="label">I am a</label><select className="input" value={f.role} onChange={set('role')}><option>Student</option><option>Faculty</option></select><p className="text-[11px] text-slate-400 mt-1">Admin and Maintenance Staff access is provided by your administrator.</p></div>}
        <div><label className="label">Password</label><input type="password" className="input" value={f.pw} onChange={set('pw')} />{tab === 'register' && f.pw && <p className={`text-[11px] mt-1 ${strong ? 'text-emerald-600' : 'text-amber-600'}`}>{strong ? 'Strong' : 'Needs 8+ chars, uppercase, number & symbol'}</p>}</div>
        {tab === 'register' && <div><label className="label">Confirm password</label><input type="password" className="input" value={f.pw2} onChange={set('pw2')} />{f.pw2 && <p className={`text-[11px] mt-1 ${f.pw === f.pw2 ? 'text-emerald-600' : 'text-red-600'}`}>{f.pw === f.pw2 ? 'Passwords match.' : 'Passwords do not match.'}</p>}</div>}
        <button className="btn justify-center py-3">{tab === 'login' ? 'Log in to FixTrack →' : 'Create account →'}</button>
        <p className="text-[11px] bg-brand-soft text-brand-dark rounded-lg p-3">Your account connects you to the right workspace—Admin, Maintenance Staff, or Student/Faculty.</p>
      </form>
    </div>
  )
}
