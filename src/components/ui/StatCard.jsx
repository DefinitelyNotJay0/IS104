export default function StatCard({ label, value, note }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-[11px] text-slate-400 mt-1">{note}</p>
    </div>
  )
}
