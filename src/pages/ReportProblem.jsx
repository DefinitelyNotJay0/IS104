import { useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { categories, facilities } from '../data/mock.js'

const FLOORS = ['1st floor', '2nd floor', '3rd floor']
const URGENCY = ['Low', 'Moderate', 'Immediate']

export default function ReportProblem() {
  const { addConcern, open } = useApp()
  const [form, setForm] = useState({ facility: '', floor: '', room: '', title: '', category: 'Electrical', desc: '', urg: 2 })
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')
  const [reading, setReading] = useState(false)
  const reader = useRef(null)
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value })

  const pick = (event) => {
    reader.current?.abort()
    setPhoto(null)
    setError('')
    setReading(false)
    const field = event.target
    const file = field.files[0]
    if (!file) return
    const validation = !['image/png', 'image/jpeg'].includes(file.type) ? 'Choose a PNG or JPEG photo.' : file.size > 5 * 1024 * 1024 ? 'Choose a photo that is 5 MB or smaller.' : ''
    if (validation) {
      field.value = ''
      return setError(validation)
    }
    const nextReader = new FileReader()
    reader.current = nextReader
    setReading(true)
    nextReader.onload = () => {
      setPhoto({ name: file.name, url: nextReader.result })
      setReading(false)
    }
    nextReader.onerror = () => {
      field.value = ''
      setError('The photo could not be opened. Choose a different file.')
      setReading(false)
    }
    nextReader.readAsDataURL(file)
  }

  const submit = (event) => {
    event.preventDefault()
    if (reading || !photo) return setError('Attach a photo of the problem before submitting.')
    const id = addConcern({
      title: form.title.trim(), facility: form.facility, loc: `${form.floor} · ${form.room.trim()}`,
      category: form.category, urg: form.urg, priority: ['', 'Low', 'Medium', 'High'][form.urg], desc: form.desc.trim(), photo: photo.url,
    })
    open(id)
  }

  return (
    <>
      <div><h1 className="page-title">Report a problem</h1><p className="page-description">Give maintenance staff an exact location, a description, and a photo of the issue.</p></div>
      <form onSubmit={submit} className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] xl:gap-5">
        <section className="card space-y-4 p-4 sm:p-6">
          <h2 className="section-title">Concern details</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className="label" htmlFor="building">Building</label><select id="building" className="input" required value={form.facility} onChange={update('facility')}><option value="">Select building</option>{facilities.map(({ name }) => <option key={name}>{name}</option>)}</select></div>
            <div><label className="label" htmlFor="floor">Floor</label><select id="floor" className="input" required value={form.floor} onChange={update('floor')}><option value="">Select floor</option>{FLOORS.map((floor) => <option key={floor}>{floor}</option>)}</select></div>
            <div><label className="label" htmlFor="room">Room</label><input id="room" className="input" required pattern=".*\S.*" maxLength={60} placeholder="e.g. L-204" value={form.room} onChange={update('room')} /></div>
          </div>
          <div><label className="label" htmlFor="problem-title">Problem title</label><input id="problem-title" className="input" required pattern=".*\S.*" maxLength={120} placeholder="e.g. Exposed power socket" value={form.title} onChange={update('title')} /></div>
          <fieldset><legend className="label">Category</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{categories.map(({ name }) => <button key={name} type="button" aria-pressed={form.category === name} className="choice" onClick={() => setForm({ ...form, category: name })}>{name}</button>)}</div></fieldset>
          <div><label className="label" htmlFor="description">Description</label><textarea id="description" className="input min-h-28" required maxLength={2000} placeholder="Describe the issue, where it is, and how it affects the space." value={form.desc} onChange={(event) => { event.target.setCustomValidity(event.target.value && !event.target.value.trim() ? 'Describe the problem before submitting.' : ''); update('desc')(event) }} /></div>
          <fieldset><legend className="label">Urgency</legend><div className="grid grid-cols-3 gap-2">{URGENCY.map((label, index) => <button key={label} type="button" aria-pressed={form.urg === index + 1} className="choice" onClick={() => setForm({ ...form, urg: index + 1 })}>{label}</button>)}</div><p className="mt-2 text-xs text-slate-600">An administrator will review your urgency rating and set the repair priority.</p></fieldset>
        </section>
        <div className="min-w-0 space-y-4">
          <section className="card p-4 sm:p-6">
            <h2 className="section-title">Photo evidence</h2>
            <p id="photo-help" className="mb-3 mt-1 text-sm text-slate-600">Attach a PNG or JPEG, up to 5 MB. Keep faces and personal information out of the photo.</p>
            <label className="sr-only" htmlFor="evidence">Photo of the problem</label>
            <input id="evidence" className="block min-h-11 w-full rounded-xl border border-dashed border-slate-400 p-2 text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-brand-soft file:px-2 file:py-1.5 file:font-semibold file:text-brand-dark" type="file" accept="image/png,image/jpeg" required aria-describedby="photo-help" onChange={pick} />
            {reading && <p className="mt-2 text-sm text-slate-600" role="status">Loading photo…</p>}
            {error && <p className="mt-2 text-sm text-red-800" role="alert">{error}</p>}
            {photo && <figure className="mt-3"><img src={photo.url} alt="Preview of the attached evidence" className="max-h-52 w-full rounded-xl bg-slate-100 object-contain" /><figcaption className="mt-1 break-all text-xs text-slate-600">{photo.name}</figcaption></figure>}
          </section>
          <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><h2 className="font-semibold">Immediate safety risk?</h2><p className="mt-1">Move away from the hazard and contact campus security.</p></aside>
        </div>
        <div className="flex justify-end xl:col-span-2"><button className="btn w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto" type="submit" disabled={reading}>Submit concern →</button></div>
      </form>
    </>
  )
}
