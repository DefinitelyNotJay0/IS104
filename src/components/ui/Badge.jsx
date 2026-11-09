const tone = {
  High: 'bg-red-50 text-red-600', Critical: 'bg-red-100 text-red-700', Medium: 'bg-amber-50 text-amber-700', Low: 'bg-slate-100 text-slate-600',
  Pending: 'bg-amber-50 text-amber-700', 'In Progress': 'bg-blue-50 text-blue-700', 'For Verification': 'bg-violet-50 text-violet-700', Completed: 'bg-emerald-50 text-emerald-700',
}
export default function Badge({ value }) {
  return <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${tone[value] || 'bg-slate-100'}`}>{value}</span>
}
