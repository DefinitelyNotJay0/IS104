import { HR } from './helpers.js'
const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0)

// Turns raw report data into totals, a cumulative trend series, and plain-language insights.
export function summarize({ concerns, weekly, facilities, categories, staff }) {
  let r = 0, d = 0
  const series = weekly.map((w) => { r += w.reports; d += w.done; return { label: w.label, reported: r, resolved: d, backlog: r - d } })
  const total = r, done = d, open = r - d, rate = pct(done, total)
  const last = weekly[weekly.length - 1]
  const worstFac = [...facilities].sort((a, b) => b.total - b.done - (a.total - a.done))[0]
  const topCat = [...categories].sort((a, b) => b.total - a.total)[0]
  const slowCat = [...categories].sort((a, b) => b.avgDays - a.avgDays)[0]
  const urgent = concerns.filter((c) => ['High', 'Critical'].includes(c.priority) && c.status === 'Pending')
  const avg = (a) => (a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10 : 0)
  const responseHrs = avg(concerns.filter((c) => c.assignedAt).map((c) => (c.assignedAt - c.createdAt) / HR))
  const completionHrs = avg(concerns.filter((c) => c.doneAt).map((c) => (c.doneAt - c.createdAt) / HR))
  const waiting = concerns.filter((c) => c.status === 'Pending').sort((a, b) => a.createdAt - b.createdAt)[0]
  const busy = [...staff].sort((a, b) => b.active - a.active)
  const idle = busy[busy.length - 1]
  const insights = [
    { tone: series[series.length - 1].backlog > series[0].backlog ? 'bad' : 'good',
      title: `Open backlog grew from ${series[0].backlog} to ${open} in ${weekly.length} weeks`,
      detail: `Only ${pct(last.done, last.reports)}% of last week's ${last.reports} reports were resolved. At this pace the backlog reaches about ${open + last.reports - last.done} next week.`,
      action: 'Add repair capacity or schedule a clearing day for Low/Medium concerns.' },
    { tone: 'warn', title: `${worstFac.name} has the most open concerns (${worstFac.total - worstFac.done})`,
      detail: `${pct(worstFac.done, worstFac.total)}% completed vs ${rate}% campus-wide.`,
      action: `Schedule a walkthrough of the ${worstFac.name} to clear repeat issues.` },
    { tone: 'warn', title: `${topCat.name} causes ${pct(topCat.total, total)}% of all reports`,
      detail: `${slowCat.name} is the slowest to fix, averaging ${slowCat.avgDays} days per repair.`,
      action: `Plan preventive inspections for ${topCat.name}; review why ${slowCat.name} repairs take longer.` },
    urgent.length
      ? { tone: 'bad', title: `${urgent.length} High/Critical concern${urgent.length > 1 ? 's are' : ' is'} still unassigned`, detail: urgent.map((c) => `${c.id} ${c.title}`).join(', '), action: 'Review priority and assign staff today.' }
      : { tone: 'good', title: 'All High/Critical concerns have an assigned repair lead', detail: 'No urgent items are waiting for assignment.', action: 'Keep monitoring new reports.' },
    { tone: 'info', title: `${busy[0].name} carries the most active repairs (${busy[0].active})`,
      detail: `${idle.name} has ${idle.active}. A ${busy[0].active - idle.active}-repair gap suggests workload can be rebalanced.`,
      action: 'Route the next matching concern to the lighter workload.' },
    waiting
      ? { tone: 'warn', title: `${waiting.id} has waited ${Math.round((Date.now() - waiting.createdAt) / HR)} hrs for review`, detail: `Average response time (report to assignment) is ${responseHrs} hrs.`, action: 'Review pending concerns in priority order.' }
      : { tone: 'good', title: 'No concerns are waiting for review', detail: `Average response time is ${responseHrs} hrs.`, action: 'Keep monitoring new reports.' },
  ]
  return { series, total, done, open, rate, responseHrs, completionHrs, insights }
}
