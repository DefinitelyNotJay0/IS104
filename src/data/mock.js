const NOW = Date.now(), H = (n) => NOW - n * 3600000
const mk = (c) => {
  const log = [{ title: 'Concern reported', desc: `${c.reporter} reported: ${c.title}.`, at: c.createdAt }]
  if (c.assignedAt) log.push({ title: 'Reviewed, prioritized & assigned', desc: `Priority ${c.priority}; assigned to ${c.assigned}.`, at: c.assignedAt })
  if (c.progress > 0 && c.status !== 'Completed') log.push({ title: 'Repair session report', desc: c.note || 'Repair under way.', at: c.assignedAt + 3600000 })
  if (c.doneAt) log.push({ title: 'Verified & completed', desc: 'Administrator verified the repair and notified the reporter.', at: c.doneAt })
  return { ...c, log }
}
export const concerns = [
  { id: 'FT-1048', title: 'Exposed power socket', facility: 'Library', loc: '2nd floor · L-204', category: 'Electrical', priority: 'High', urg: 3, status: 'Pending', assigned: null, reporter: 'Maya Chen', createdAt: H(5), progress: 0, desc: 'The socket cover beside the reading desk is cracked and the inner wiring is exposed. Students are still using nearby desks.' },
  { id: 'FT-1047', title: 'Leaking ceiling pipe', facility: 'Classrooms', loc: '1st floor · IK 108', category: 'Plumbing', priority: 'High', urg: 3, status: 'In Progress', assigned: 'Reign Dagum', reporter: 'Gere Cagandahan', createdAt: H(30), assignedAt: H(29), progress: 60, note: 'Leak source identified. Water isolated; replacing the damaged pipe joint.', desc: 'Water is dripping above the front row. The ceiling tile is damp and a small puddle is forming.' },
  { id: 'FT-1046', title: 'PC units not starting', facility: 'Computer Lab', loc: '1st floor · IL 102', category: 'IT/PC Unit', priority: 'Medium', urg: 2, status: 'Pending', assigned: null, reporter: 'Noah Williams', createdAt: H(8), progress: 0, desc: 'Several PC units fail to boot.' },
  { id: 'FT-1044', title: 'Flickering reading lights', facility: 'Library', loc: '2nd floor · IL 201', category: 'Electrical', priority: 'Medium', urg: 2, status: 'In Progress', assigned: 'Cyruz Neo Flores', reporter: 'Maya Chen', createdAt: H(52), assignedAt: H(50), progress: 30, note: 'Checking the ballast and wiring.', desc: 'Reading lights flicker.' },
  { id: 'FT-1043', title: 'Projector connection issue', facility: 'Classrooms', loc: '2nd floor · IK 205', category: 'IT/PC Unit', priority: 'Medium', urg: 2, status: 'Completed', assigned: 'Noel Cerbito Jr', reporter: 'Noah Williams', createdAt: H(100), assignedAt: H(98), doneAt: H(75), progress: 100, desc: 'Projector does not detect the laptop.' },
  { id: 'FT-1045', title: 'Broken desk chair', facility: 'Faculty Room', loc: '1st floor · IK 103', category: 'Furniture', priority: 'Low', urg: 1, status: 'Completed', assigned: 'Reign Dagum', reporter: 'Gere Cagandahan', createdAt: H(40), assignedAt: H(38), doneAt: H(30), progress: 100, desc: 'Chair leg is broken.' },
  { id: 'FT-1040', title: 'Loose study table leg', facility: 'Library', loc: '1st floor · IK 101', category: 'Furniture', priority: 'Low', urg: 1, status: 'Completed', assigned: 'Reign Dagum', reporter: 'Maya Chen', createdAt: H(150), assignedAt: H(148), doneAt: H(120), progress: 100, desc: 'Study table wobbles.', confirmed: true },
].map(mk)
export const notices = [
  { id: 1, to: 'Maya Chen', text: 'Your library lighting repair (FT-1044) has started.', ref: 'FT-1044', at: H(2), read: false },
  { id: 2, to: 'Maya Chen', text: 'We received your report FT-1048. An administrator will review it.', ref: 'FT-1048', at: H(5), read: false },
  { id: 3, to: 'admin', text: 'New concern FT-1048: Exposed power socket', ref: 'FT-1048', at: H(5), read: false },
  { id: 4, to: 'Cyruz Neo Flores', text: 'FT-1044 was assigned to you: Flickering reading lights', ref: 'FT-1044', at: H(50), read: false },
]
export const staff = [
  { id: 1, name: 'Reign Dagum', role: 'Plumbing & general repairs', skills: ['Plumbing', 'Furniture'] },
  { id: 2, name: 'Cyruz Neo Flores', role: 'Electrical maintenance', skills: ['Electrical'] },
  { id: 3, name: 'Noel Cerbito Jr', role: 'IT & computer systems', skills: ['IT/PC Unit'] },
]
export const facilities = [
  { name: 'Library', total: 16, done: 8 }, { name: 'Classrooms', total: 14, done: 7 },
  { name: 'Faculty Room', total: 6, done: 4 }, { name: 'Computer Lab', total: 12, done: 6 },
]
export const weekly = [
  { label: 'Oct 1–4', reports: 9, done: 4 }, { label: 'Oct 5–9', reports: 13, done: 6 },
  { label: 'Oct 8–12', reports: 14, done: 8 }, { label: 'Oct 13–16', reports: 12, done: 7 },
]
export const categories = [
  { name: 'Electrical', total: 15, done: 8, avgDays: 1.8 }, { name: 'Plumbing', total: 11, done: 6, avgDays: 1.2 },
  { name: 'Furniture', total: 9, done: 6, avgDays: 0.9 }, { name: 'IT/PC Unit', total: 13, done: 5, avgDays: 2.6 },
]
