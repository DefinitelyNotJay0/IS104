import { HR } from './helpers.js'

const average = (values) => values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length * 10) / 10 : null
export const percentage = (value, total) => total ? Math.round(value / total * 1000) / 10 : 0

function breakdown(names, concerns, field) {
  return names.map(({ name }) => {
    const rows = concerns.filter((concern) => concern[field] === name)
    const completed = rows.filter((concern) => concern.status === 'Completed')
    return {
      name, total: rows.length, done: completed.length, open: rows.length - completed.length,
      avgDays: average(completed.filter((c) => c.doneAt).map((c) => (c.doneAt - c.createdAt) / (24 * HR))),
    }
  })
}

export function summarize({ concerns, facilities, categories }) {
  const chronological = [...concerns].sort((a, b) => a.createdAt - b.createdAt)
  const completed = concerns.filter((c) => c.status === 'Completed')
  const completionDates = completed.filter((c) => c.doneAt).map((c) => c.doneAt).sort((a, b) => a - b)
  const today = new Date()
  let reported = 0
  let resolved = 0
  const series = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + index)
    const cutoff = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime()
    while (reported < chronological.length && chronological[reported].createdAt < cutoff) reported++
    while (resolved < completionDates.length && completionDates[resolved] < cutoff) resolved++
    return { label: date.toLocaleDateString([], { month: 'short', day: 'numeric' }), reported, resolved }
  })

  return {
    series,
    total: concerns.length,
    done: completed.length,
    rate: percentage(completed.length, concerns.length),
    responseHrs: average(concerns.filter((c) => c.assignedAt).map((c) => (c.assignedAt - c.createdAt) / HR)),
    completionHrs: average(completed.filter((c) => c.doneAt).map((c) => (c.doneAt - c.createdAt) / HR)),
    facilities: breakdown(facilities, concerns, 'facility'),
    categories: breakdown(categories, concerns, 'category').sort((a, b) => b.total - a.total),
    history: completed.sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0)),
    urgent: concerns.filter((c) => c.status === 'Pending' && ['High', 'Critical'].includes(c.priority)),
  }
}
