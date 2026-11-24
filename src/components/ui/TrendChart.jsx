import { useId } from 'react'

export default function TrendChart({ data }) {
  const description = useId()
  const top = Math.max(4, ...data.map((point) => point.reported))
  const step = Math.ceil(top / 4)
  const max = step * 4
  const x = (index) => 32 + index * 49
  const y = (value) => 16 + (1 - value / max) * 127
  const points = (field, reverse = false) => data.map((_, index) => {
    const i = reverse ? data.length - 1 - index : index
    return `${x(i)},${y(data[i][field])}`
  }).join(' ')
  const latest = data[data.length - 1]

  return (
    <figure>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm"><span className="flex items-center gap-2"><i aria-hidden="true" className="h-1 w-4 rounded bg-slate-600" />Reports received</span><span className="flex items-center gap-2"><i aria-hidden="true" className="h-1 w-4 rounded bg-brand" />Repairs completed</span></div>
      <svg viewBox="0 0 354 175" role="img" aria-labelledby={description} className="mx-auto mt-2 block w-full max-w-xl">
        <title id={description}>{data.map((point) => `${point.label}, ${point.reported} reported and ${point.resolved} completed`).join('. ')}</title>
        {[0, step, step * 2, step * 3, max].map((tick) => <g key={tick}><line x1="32" x2="326" y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" /><text x="25" y={y(tick) + 4} fontSize="11" textAnchor="end" fill="#475569">{tick}</text></g>)}
        <polygon points={`${points('reported')} ${points('resolved', true)}`} fill="#e6f4f3" />
        <polyline points={points('reported')} fill="none" stroke="#475569" strokeWidth="2" />
        <polyline points={points('resolved')} fill="none" stroke="#0b7f84" strokeWidth="2" />
        {data.map((point, index) => <g key={point.label}><circle cx={x(index)} cy={y(point.reported)} r="2.5" fill="#475569" /><circle cx={x(index)} cy={y(point.resolved)} r="2.5" fill="#0b7f84" />{index % 2 === 0 && <text x={x(index)} y="163" fontSize="11" textAnchor="middle" fill="#475569">{point.label}</text>}</g>)}
      </svg>
      <figcaption className="mt-1 text-sm text-slate-600"><strong className="text-ink">{latest.reported - latest.resolved}</strong> open as of {latest.label}</figcaption>
    </figure>
  )
}
