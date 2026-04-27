const I = ({ d, className = 'h-5 w-5' }: { d: React.ReactNode; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">{d}</svg>
)

export const Icon = {
  dash:    <I d={<><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></>} />,
  cycle:   <I d={<><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 3v4h-4M6 21v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>} />,
  target:  <I d={<><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></>} />,
  goals:   <I d={<><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  doc:     <I d={<><path d="M6 3h9l4 4v14H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />,
  team:    <I d={<><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 19c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  clock:   <I d={<><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  feedback:<I d={<path d="M4 5h16v10H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  paper:   <I d={<><path d="M5 3h11l3 3v15H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 11h8M8 14h6M8 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  cog:     <I d={<><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.2-1.3L14 3h-4l-.4 2.4a7 7 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.2 1.3L10 21h4l.4-2.4a7 7 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></>} />,
  bell:    <I d={<><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  search:  <I d={<><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  chev:    <I d={<path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  chevDown:<I d={<path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  arrowUp: <I d={<path d="M12 19V5m0 0-5 5m5-5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>} className="h-3.5 w-3.5" />,
  arrowDn: <I d={<path d="M12 5v14m0 0-5-5m5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>} className="h-3.5 w-3.5" />,
  plus:    <I d={<path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>} />,
  x:       <I d={<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>} />,
  check:   <I d={<path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>} />,
  warn:    <I d={<><path d="M12 4 2.5 20h19L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 10v4M12 17v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  filter:  <I d={<path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  trash:   <I d={<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  edit:    <I d={<><path d="M4 20h4l11-11-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} className="h-4 w-4" />,
  download:<I d={<><path d="M12 4v12m0 0-4-4m4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 18v2h14v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>} />,
  send:    <I d={<path d="M4 12 20 4l-3 16-5-7-8-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  print:   <I d={<><path d="M7 9V4h10v5M7 18h10v3H7zM6 9h12a2 2 0 0 1 2 2v5h-3v-2H7v2H4v-5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />,
  building:<I d={<><path d="M5 21V5a2 2 0 0 1 2-2h7v18M14 21V9h5v12M5 21h17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 7h3M8 11h3M8 15h3M17 13h.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  layers:  <I d={<><path d="M12 4 3 9l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m3 14 9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />,
  user:    <I d={<><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  star:    <I d={<path d="m12 3 2.6 6 6.4.6-4.8 4.4 1.4 6.4L12 17l-5.6 3.4 1.4-6.4L3 9.6 9.4 9 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  bar:     <I d={<><path d="M4 19h16M7 16V9m5 7V5m5 11v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>} />,
}

export type IconKey = keyof typeof Icon
