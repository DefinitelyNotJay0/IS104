export default function StatCard({ label, value, note }) {
  return (
    <div className="card border-t-2 border-t-teal-200 p-3.5 sm:p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{note}</p>
    </div>
  )
}
