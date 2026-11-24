export const HR = 3600000
export const STATUSES = ['Pending', 'In Progress', 'For Verification', 'Completed']
export const PRIORITY_RANK = { Critical: 0, High: 1, Medium: 2, Low: 3 }
export const fmt = (ms) => new Date(ms).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
export const ACTIVE = ['In Progress', 'For Verification']
export const workload = (concerns, name) => concerns.filter((c) => c.assigned === name && ACTIVE.includes(c.status)).length
// "System assigns the problem to the appropriate personnel": match skill to category, then lightest workload.
export const suggestStaff = (staff, concerns, category) => {
  const match = staff.filter((s) => s.skills.includes(category))
  return [...(match.length ? match : staff)].sort((a, b) => workload(concerns, a.name) - workload(concerns, b.name))[0]
}
export const level = (s) => (s >= 10 ? 'Critical' : s >= 7 ? 'High' : s >= 4 ? 'Medium' : 'Low')
