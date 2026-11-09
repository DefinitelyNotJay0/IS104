const OBJ = [
  ['Identify reporting problems & submission requirements', 'Report a Problem — required location, description, photo'],
  ['Priority-determination mechanism (severity × urgency)', 'Priority Review modal on Facility Concerns'],
  ['Assignment & tracking module', 'Staff Assignments + Repair Status timeline'],
  ['Repair verification feature', 'Admin “Verify completion” + reporter confirmation'],
  ['Maintenance history & reporting dashboard', 'Analytics & History + generated reports'],
]
const SCOPE = [
  'Users file a detailed report in a dedicated section (precise location, description, visual evidence).',
  'The administrator reviews each report and assigns severity and urgency; the system computes the priority.',
  'The system routes the concern to suitable maintenance personnel, who report to the administrator after every repair session to update the status.',
  'The administrator verifies completion first, then gives feedback to the reporting user.',
  'The system generates a maintenance history log and basic analytics (issue frequency, response and completion time).',
]
const LIMITS = [
  'No procurement, budgeting, or purchasing of repair materials and equipment.',
  'No personnel scheduling, payroll, or performance evaluation beyond task assignment and completion tracking.',
  'No real-time GPS tracking; progress updates are manually input by assigned staff.',
  'Limited to facility-related concerns within university premises; no off-campus or third-party contracted services.',
  'Priority ranking and assignment rely on the accuracy and honesty of the reporting user’s information, location and evidence.',
]
const List = ({ title, items }) => <div className="card p-5"><b className="text-sm">{title}</b><ol className="list-decimal ml-5 mt-3 space-y-2 text-sm text-slate-600">{items.map((i) => <li key={i}>{i}</li>)}</ol></div>
export default function About() {
  return (
    <>
      <div><p className="text-[10px] font-bold text-brand">IS104 · GROUP 2 · SBIS-3A</p><h1 className="text-2xl font-bold">Scope & Limitations</h1><p className="text-xs text-slate-500">Campus Facility Concern Management System with Priority-Based Repair Assignment</p></div>
      <div className="card p-5"><b className="text-sm">Specific objectives → where they live in the system</b><table className="w-full text-sm mt-3"><tbody>{OBJ.map(([a, b], i) => <tr key={a} className="border-t"><td className="py-2 pr-3 text-slate-400">{i + 1}</td><td className="pr-4">{a}</td><td className="text-brand font-semibold">{b}</td></tr>)}</tbody></table></div>
      <div className="grid lg:grid-cols-2 gap-4"><List title="Scope" items={SCOPE} /><List title="Limitations / Delimitations" items={LIMITS} /></div>
    </>
  )
}
