const paths = {
  tool: 'M14.7 6.3a4 4 0 0 0-5.4 5.4l-5.1 5.1a2.1 2.1 0 0 0 3 3l5.1-5.1a4 4 0 0 0 5.4-5.4L15 12l-3-3z',
  dashboard: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  report: 'M12 5v14 M5 12h14',
  concerns: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  status: 'M3 12h4l3-6 4 12 3-6h4',
  staff: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-3.9 M12 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M16 4a3 3 0 0 1 0 6',
  analytics: 'M4 4v16h16 M9 15v-3 M14 15V8 M19 15V5',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  close: 'M6 6l12 12 M6 18 18 6',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-2 7-2 9h16c0-2-2-2-2-9 M10 21h4',
  search: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0z M14.5 14.5 20 20',
  logout: 'M9 4H4v16h5 M10 12h10 M16 8l4 4-4 4',
}

export default function Icon({ name, className = 'size-5' }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}
