// Line chart: cumulative reports received vs repairs resolved. The shaded gap = open backlog.
export default function TrendChart({ data }) {
  const W = 600, H = 270, L = 36, R = 28, T = 20, B = 34, n = data.length
  const max = Math.ceil(Math.max(...data.map((d) => d.reported)) / 10) * 10
  const x = (i) => L + (i * (W - L - R)) / (n - 1)
  const y = (v) => T + (1 - v / max) * (H - T - B)
  const line = (k) => data.map((d, i) => `${x(i)},${y(d[k])}`).join(' ')
  const gap = `${line('reported')} ${[...data].reverse().map((d, i) => `${x(n - 1 - i)},${y(d.resolved)}`).join(' ')}`
  const ticks = Array.from({ length: max / 10 + 1 }, (_, i) => i * 10)
  const end = data[n - 1]
  return (
    <div>
      <div className="flex gap-4 text-xs mb-2"><span className="flex items-center gap-1"><i className="w-3 h-1 bg-red-500 inline-block" />Reports received</span><span className="flex items-center gap-1"><i className="w-3 h-1 bg-emerald-600 inline-block" />Repairs resolved</span><span className="flex items-center gap-1"><i className="w-3 h-3 bg-red-100 inline-block" />Open backlog (gap)</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {ticks.map((t) => <g key={t}><line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#e2e8f0" /><text x={L - 6} y={y(t) + 3} fontSize="10" textAnchor="end" fill="#94a3b8">{t}</text></g>)}
        <polygon points={gap} fill="#fee2e2" opacity=".8" />
        <polyline points={line('reported')} fill="none" stroke="#ef4444" strokeWidth="2.5" />
        <polyline points={line('resolved')} fill="none" stroke="#059669" strokeWidth="2.5" />
        {data.map((d, i) => <g key={d.label}>
          <circle cx={x(i)} cy={y(d.reported)} r="4" fill="#ef4444" /><text x={x(i)} y={y(d.reported) - 8} fontSize="11" fontWeight="700" textAnchor="middle" fill="#b91c1c">{d.reported}</text>
          <circle cx={x(i)} cy={y(d.resolved)} r="4" fill="#059669" /><text x={x(i)} y={y(d.resolved) + 16} fontSize="11" fontWeight="700" textAnchor="middle" fill="#047857">{d.resolved}</text>
          <text x={x(i)} y={H - 10} fontSize="10" textAnchor="middle" fill="#64748b">{d.label}</text></g>)}
        <text x={x(n - 1) - 8} y={(y(end.reported) + y(end.resolved)) / 2 + 4} fontSize="12" fontWeight="700" textAnchor="end" fill="#b91c1c">{end.backlog} open</text>
      </svg>
    </div>
  )
}
