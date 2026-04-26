// shell.jsx — Shared chrome (icons, primitives, sidebar, header) for all PMS pages
const { useState: _useState, useEffect: _useEffect, useRef: _useRef } = React;

// brand presets shared
const BRAND_PRESETS = {
  indigo:  { 50:'#ecf3ff',100:'#dde9ff',400:'#7592ff',500:'#465fff',600:'#3641f5',700:'#2a31d8' },
  teal:    { 50:'#effcf6',100:'#d4f6e6',400:'#34d39d',500:'#0bb583',600:'#089168',700:'#066d4f' },
  emerald: { 50:'#ecfdf5',100:'#d1fae5',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857' },
  violet:  { 50:'#f5f3ff',100:'#ede9fe',400:'#a78bfa',500:'#7c5cff',600:'#6940f0',700:'#5430cf' },
  orange:  { 50:'#fff5ec',100:'#ffe5cc',400:'#ff9a3c',500:'#f97316',600:'#dd5e0a',700:'#b14808' },
};

// ICONS
const I = ({ d, className='h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">{d}</svg>
);
const Icon = {
  dash:    <I d={<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>} />,
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
};

// PRIMITIVES
function Avatar({ initials, size='sm', tone='brand' }) {
  const sz = size === 'lg' ? 'h-10 w-10 text-sm' : size === 'md' ? 'h-9 w-9 text-xs' : 'h-8 w-8 text-[11px]';
  const tones = {
    brand:   'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
    error:   'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-300',
    gray:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  };
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sz} ${tones[tone]||tones.gray}`}>
      {initials}
    </div>
  );
}

function Badge({ children, tone='gray' }) {
  const tones = {
    gray:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    error:   'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
    brand:   'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
    info:    'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

// SIDEBAR for HR persona — links across pages via plain hrefs
function HRSidebar({ active }) {
  const items = [
    { id:'hr_dashboard',   label:'Dashboard',     icon: Icon.dash,    href:'HR Dashboard.html' },
    { id:'organization',   label:'Organization',  icon: Icon.building, href:'Organization.html' },
    { id:'templates',      label:'KRA Templates', icon: Icon.layers,  href:'KRA Templates.html', badge:'4' },
    { id:'cycles',         label:'Cycles',        icon: Icon.clock,   href:'Cycles.html' },
    { id:'distribution',   label:'Distribution',  icon: Icon.send,    href:'Distribution.html' },
    { id:'reports',        label:'Reports',       icon: Icon.bar,     href:'Reports.html' },
  ];
  const settings = [{ id:'settings', label:'Settings', icon: Icon.cog }];
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-gray-900 lg:flex">
      <a href="KPI Dashboard.html" className="flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M5 17l4-9 3 6 3-4 4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-gray-800 dark:text-white">Performa</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">HR Console</p>
        </div>
      </a>

      <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">HR Menu</p>
      <nav className="mt-2 flex flex-col gap-1">
        {items.map(it => {
          const isActive = it.id === active;
          const Tag = it.href ? 'a' : 'button';
          const props = it.href ? { href: it.href } : {};
          return (
            <Tag key={it.id} {...props}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-white/90'
              }`}>
              <span className={isActive ? 'text-brand-500 dark:text-brand-300' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'}>
                {it.icon}
              </span>
              <span className="flex-1 text-left">{it.label}</span>
              {it.badge && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isActive ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>{it.badge}</span>
              )}
            </Tag>
          );
        })}
      </nav>

      <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">Other</p>
      <nav className="mt-2 flex flex-col gap-1">
        {settings.map(it => (
          <button key={it.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.03]">
            <span className="text-gray-400 dark:text-gray-500">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>

      <a href="KPI Dashboard.html" className="mt-auto block rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-white p-4 hover:border-brand-300 dark:border-gray-800 dark:from-brand-500/10 dark:to-transparent">
        <p className="text-xs font-semibold text-gray-800 dark:text-white/90">Switch to Employee view</p>
        <p className="mt-1 text-[11px] leading-snug text-gray-500 dark:text-gray-400">Open Aqmal's My Appraisals dashboard.</p>
      </a>
    </aside>
  );
}

function Header({ user, badge, breadcrumb, primary }) {
  const [menuOpen, setMenuOpen] = _useState(false);
  const menuRef = _useRef(null);

  _useEffect(() => {
    if (!menuOpen) return;
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="relative hidden md:block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icon.search}</span>
          <input type="text" placeholder="Search employees, templates, cycles…"
            className="h-10 w-80 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-16 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200 dark:placeholder:text-gray-500" />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">⌘K</kbd>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {primary}
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
            {Icon.bell}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error-500 ring-2 ring-white dark:ring-gray-900" />
          </button>

          {/* User chip + dropdown */}
          <div ref={menuRef} className="relative ml-2">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <Avatar initials={user.initials} size="md" tone="brand" />
              <div className="hidden pr-2 text-left lg:block">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{user.name}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
              <span className="hidden pr-1 text-gray-400 lg:block">{Icon.chevDown}</span>
            </button>

            {menuOpen && (
              <div style={{
                position:'absolute', right:0, top:'calc(100% + 8px)', zIndex:50,
                background:'var(--bg-card,#fbfaf6)', border:'1px solid var(--border,#e2dccb)',
                borderRadius:'14px', minWidth:'200px',
                boxShadow:'0 2px 4px rgba(20,18,8,.05), 0 16px 32px -12px rgba(20,18,8,.14), 0 0 0 1px rgba(20,18,8,.04)',
                padding:'6px',
                animation:'hdr-drop 0.15s cubic-bezier(.16,.84,.34,1) both',
              }}>
                {/* User info row */}
                <div style={{ padding:'10px 12px 8px', borderBottom:'1px solid var(--border,#e2dccb)', marginBottom:'4px' }}>
                  <p style={{ fontFamily:'Geist,sans-serif', fontSize:'13.5px', fontWeight:600, color:'var(--text-strong,#14182a)', letterSpacing:'-0.01em' }}>{user.name}</p>
                  <p style={{ fontFamily:'Geist,sans-serif', fontSize:'12px', color:'var(--text-muted,#5b6178)', marginTop:'1px' }}>{user.role}</p>
                </div>

                {/* My Account */}
                <a href="My Account.html" onClick={() => setMenuOpen(false)} style={{
                  display:'flex', alignItems:'center', gap:'10px',
                  padding:'9px 12px', borderRadius:'9px', textDecoration:'none',
                  color:'var(--text-body,#2f3548)', fontFamily:'Geist,sans-serif', fontSize:'14px',
                  transition:'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle,#ede9df)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <svg viewBox="0 0 24 24" style={{ width:'16px', height:'16px', flexShrink:0, color:'var(--text-muted,#5b6178)' }} fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  My Account
                </a>

                {/* Divider */}
                <div style={{ height:'1px', background:'var(--border,#e2dccb)', margin:'4px 0' }}/>

                {/* Sign out */}
                <button onClick={() => { setMenuOpen(false); window.location.href='Login.html'; }} style={{
                  display:'flex', alignItems:'center', gap:'10px', width:'100%',
                  padding:'9px 12px', borderRadius:'9px', border:'none', background:'none',
                  color:'#b42318', fontFamily:'Geist,sans-serif', fontSize:'14px', cursor:'pointer', textAlign:'left',
                  transition:'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background='#fef3f2'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <svg viewBox="0 0 24 24" style={{ width:'16px', height:'16px', flexShrink:0 }} fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes hdr-drop {
          from { opacity:0; transform:translateY(-6px) scale(0.97); }
          to   { opacity:1; transform:none; }
        }
      `}</style>
    </header>
  );
}

// PageShell — wraps brand-color CSS overrides + layout for HR pages
function PageShell({ active, user, primary, children, brandHue='indigo', dark=false }) {
  const brand = BRAND_PRESETS[brandHue] || BRAND_PRESETS.indigo;
  _useEffect(() => {
    document.documentElement.classList.toggle('dark', !!dark);
  }, [dark]);
  return (
    <div className="min-h-screen">
      <style>{`
        .bg-brand-500 { background-color: ${brand[500]} !important; }
        .bg-brand-600 { background-color: ${brand[600]} !important; }
        .hover\\:bg-brand-600:hover { background-color: ${brand[600]} !important; }
        .bg-brand-50 { background-color: ${brand[50]} !important; }
        .bg-brand-100 { background-color: ${brand[100]} !important; }
        .text-brand-500 { color: ${brand[500]} !important; }
        .text-brand-600 { color: ${brand[600]} !important; }
        .text-brand-700 { color: ${brand[700]} !important; }
        .text-brand-400 { color: ${brand[400]} !important; }
        .border-brand-500 { border-color: ${brand[500]} !important; }
        .border-brand-300 { border-color: ${brand[400]} !important; }
        .ring-brand-500\\/10 { --tw-ring-color: ${brand[500]}1a !important; }
        .ring-brand-500\\/20 { --tw-ring-color: ${brand[500]}33 !important; }
        .focus\\:border-brand-500:focus { border-color: ${brand[500]} !important; }
        .focus\\:ring-brand-500\\/10:focus { --tw-ring-color: ${brand[500]}1a !important; }
        .from-brand-50 { --tw-gradient-from: ${brand[50]} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
        html.dark .dark\\:bg-brand-500\\/10 { background-color: ${brand[500]}1a !important; }
        html.dark .dark\\:bg-brand-500\\/15 { background-color: ${brand[500]}26 !important; }
        html.dark .dark\\:bg-brand-500\\/20 { background-color: ${brand[500]}33 !important; }
        html.dark .dark\\:text-brand-300 { color: ${brand[400]} !important; }
        html.dark .dark\\:text-brand-400 { color: ${brand[400]} !important; }
        html.dark .dark\\:from-brand-500\\/10 { --tw-gradient-from: ${brand[500]}1a !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
      `}</style>
      <div className="flex">
        <HRSidebar active={active} />
        <div className="min-w-0 flex-1">
          <Header user={user} primary={primary} />
          <main className="px-6 py-6 lg:px-8 flex flex-col gap-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// Expose globally for cross-file access
Object.assign(window, { Icon, Avatar, Badge, BRAND_PRESETS, PageShell, HRSidebar, Header });
