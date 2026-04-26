// overview.jsx — Single comprehensive view of the entire PMS system
const { useState, useMemo } = React;

// ─── Icons ───────────────────────────────────────────────────────────────────
const Ic = ({ d, className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">{d}</svg>
);
const Ico = {
  dash:     <Ic d={<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>} />,
  building: <Ic d={<><path d="M5 21V5a2 2 0 0 1 2-2h7v18M14 21V9h5v12M5 21h17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 7h3M8 11h3M8 15h3M17 13h.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  layers:   <Ic d={<><path d="M12 4 3 9l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m3 14 9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />,
  clock:    <Ic d={<><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  send:     <Ic d={<path d="M4 12 20 4l-3 16-5-7-8-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  bar:      <Ic d={<><path d="M4 19h16M7 16V9m5 7V5m5 11v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>} />,
  cog:      <Ic d={<><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.2-1.3L14 3h-4l-.4 2.4a7 7 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.2 1.3L10 21h4l.4-2.4a7 7 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></>} />,
  check:    <Ic d={<path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>} />,
  x:        <Ic d={<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>} />,
  warn:     <Ic d={<><path d="M12 4 2.5 20h19L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 10v4M12 17v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  bell:     <Ic d={<><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  search:   <Ic d={<><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  user:     <Ic d={<><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  team:     <Ic d={<><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 19c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  chev:     <Ic d={<path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  chevDown: <Ic d={<path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  star:     <Ic d={<path d="m12 3 2.6 6 6.4.6-4.8 4.4 1.4 6.4L12 17l-5.6 3.4 1.4-6.4L3 9.6 9.4 9 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  link:     <Ic d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  paper:    <Ic d={<><path d="M5 3h11l3 3v15H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 11h8M8 14h6M8 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  feedback: <Ic d={<path d="M4 5h16v10H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
};

// ─── Data ────────────────────────────────────────────────────────────────────
const EMPLOYEE = {
  name: 'Aqmal Pratama', initials: 'AP',
  position: 'Software Engineer · IC2',
  squad: 'Cart & Checkout',
  department: 'Engineering', division: 'Technology',
  squadLeader:    { name: 'Rifky Oktaviano',  initials: 'RO', role: 'Squad Leader' },
  headOfDept:     { name: 'Dewi Anggraeni',   initials: 'DA', role: 'Head of Department' },
  headOfDivision: { name: 'Bastian Wirajaya', initials: 'BW', role: 'Head of Division' },
};

const CYCLE = {
  name: 'Q1 2026 Appraisal', short: 'Q1 · 2026',
  start: 'Jan 1, 2026', end: 'Mar 31, 2026',
  template: 'Engineering · Software Engineer · v3',
  selfDeadline: 'Mar 24, 2026',
};

const APPRAISAL_STATE = 'sl_review';

const STATUS_FLOW = [
  { key: 'draft',        label: 'Draft',        actor: 'Aqmal Pratama' },
  { key: 'sl_review',    label: 'SL Review',    actor: 'Rifky Oktaviano' },
  { key: 'hod_review',   label: 'HoD Review',   actor: 'Dewi Anggraeni' },
  { key: 'hodiv_review', label: 'HoDiv Review', actor: 'Bastian Wirajaya' },
  { key: 'completed',    label: 'Completed',    actor: 'HR' },
];

const KRAS = [
  { id:'k1', title:'Reduce checkout P95 latency',   target:'P95 < 220ms',       weight:25, self:4, sl:4,   hod:null, hodiv:null },
  { id:'k2', title:'Migrate auth to OIDC provider', target:'100% rollout',       weight:20, self:5, sl:5,   hod:null, hodiv:null },
  { id:'k3', title:'Ship Indonesia payment rails',  target:'GA · DANA + GoPay',  weight:20, self:3, sl:3,   hod:null, hodiv:null },
  { id:'k4', title:'Reduce on-call alerts by 30%',  target:'≥ 30% reduction',   weight:15, self:4, sl:null, hod:null, hodiv:null },
  { id:'k5', title:'Mentor 2 junior engineers',     target:'2 IC2 promo-ready',  weight:10, self:0, sl:null, hod:null, hodiv:null },
  { id:'k6', title:'Platform reliability OKR',      target:'99.95% uptime',      weight:10, self:4, sl:null, hod:null, hodiv:null },
];

const HR_CYCLE = {
  totalEmployees: 248, invited: 248,
  draftStarted: 211, selfSubmitted: 162,
  slApproved: 118, hodApproved: 73, hodivApproved: 41, completed: 28,
};

const DIVISIONS = [
  { name: 'Engineering',   total: 84, completed: 14, inReview: 41, draft: 22, notStarted: 7,  avg: 4.12 },
  { name: 'Product',       total: 32, completed: 6,  inReview: 18, draft: 7,  notStarted: 1,  avg: 4.04 },
  { name: 'Design',        total: 18, completed: 3,  inReview: 9,  draft: 5,  notStarted: 1,  avg: 4.21 },
  { name: 'Operations',    total: 47, completed: 4,  inReview: 22, draft: 16, notStarted: 5,  avg: 3.88 },
  { name: 'Marketing',     total: 21, completed: 1,  inReview: 11, draft: 7,  notStarted: 2,  avg: 3.95 },
  { name: 'Finance',       total: 14, completed: 0,  inReview: 8,  draft: 5,  notStarted: 1,  avg: 4.00 },
  { name: 'People (HR)',   total: 12, completed: 0,  inReview: 6,  draft: 5,  notStarted: 1,  avg: 4.10 },
  { name: 'Customer Care', total: 20, completed: 0,  inReview: 9,  draft: 8,  notStarted: 3,  avg: 3.78 },
];

const ATTENTION = [
  { kind: 'error',   icon: 'x',    title: '12 employees missed self-appraisal deadline', sub: 'Mar 24 deadline · auto-reminder sent' },
  { kind: 'warning', icon: 'warn', title: '7 reviews stuck in Squad Leader stage > 5 days', sub: 'Engineering (4), Operations (2), Marketing (1)' },
  { kind: 'brand',   icon: 'bell', title: 'Calibration meeting scheduled Apr 8', sub: 'Heads of Division · 14:00–16:30 · Meeting Room Garuda' },
];

const RECENT = [
  { who:'Aqmal Hidayat',   team:'Engineering · Backend',  to:'SL review',   when:'2 min ago',  initials:'AH', tone:'brand' },
  { who:'Kirana Andini',   team:'Design · Product',       to:'HoD review',  when:'14 min ago', initials:'KA', tone:'success' },
  { who:'Bagas Widodo',    team:'Operations · Logistics', to:'SL review',   when:'38 min ago', initials:'BW', tone:'warning' },
  { who:'Citra Pertiwi',   team:'Marketing · Growth',     to:'HoDiv review',when:'1 h ago',    initials:'CP', tone:'brand' },
  { who:'Reno Saputra',    team:'Engineering · Mobile',   to:'Completed',   when:'2 h ago',    initials:'RS', tone:'success' },
];

const SCORE_LABELS = ['—', 'Below', 'Partial', 'Meets', 'Exceeds', 'Outstanding'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function scoreBg(s) {
  if (!s || s === 0) return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
  if (s >= 5) return 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400';
  if (s >= 4) return 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300';
  if (s >= 3) return 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400';
  return 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400';
}

function weightedAvg(kras, field) {
  let sum = 0, tot = 0;
  kras.forEach(k => {
    const v = k[field];
    if (v != null && v > 0) { sum += v * k.weight; tot += k.weight; }
  });
  return tot > 0 ? (sum / tot).toFixed(2) : '—';
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function Av({ initials, tone = 'brand', size = 'sm' }) {
  const sz = size === 'lg' ? 'h-10 w-10 text-sm' : size === 'md' ? 'h-9 w-9 text-xs' : 'h-8 w-8 text-[11px]';
  const cls = {
    brand:   'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
    gray:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  };
  return <div className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sz} ${cls[tone] || cls.gray}`}>{initials}</div>;
}

function Pill({ children, tone = 'gray' }) {
  const cls = {
    gray:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    error:   'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
    brand:   'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls[tone]}`}>{children}</span>;
}

function SectionHead({ label, sub, action }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{label}</h2>
        {sub && <p className="text-[13px] text-gray-500 dark:text-gray-400">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar() {
  const items = [
    { label: 'Overview',       icon: Ico.star,     href: 'Overview.html',        active: true },
    { label: 'My Appraisal',   icon: Ico.dash,     href: 'KPI Dashboard.html' },
    { label: 'Self Appraisal', icon: Ico.paper,    href: 'Self Appraisal.html' },
    { label: 'SL Review',      icon: Ico.feedback, href: 'SL Review.html' },
    { label: 'HoD Review',     icon: Ico.team,     href: 'HoD Review.html' },
    { label: 'HoDiv Review',   icon: Ico.layers,   href: 'HoDiv Review.html' },
    { label: 'HR Dashboard',   icon: Ico.bar,      href: 'HR Dashboard.html' },
    { label: 'Organization',   icon: Ico.building, href: 'Organization.html' },
    { label: 'KRA Templates',  icon: Ico.layers,   href: 'KRA Templates.html',   badge: '4' },
    { label: 'Cycles',         icon: Ico.clock,    href: 'Cycles.html' },
    { label: 'Distribution',   icon: Ico.send,     href: 'Distribution.html' },
    { label: 'Reports',        icon: Ico.bar,      href: 'Reports.html' },
  ];
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-gray-900 lg:flex overflow-y-auto">
      <a href="KPI Dashboard.html" className="flex items-center gap-2.5 px-1 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M5 17l4-9 3 6 3-4 4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-gray-800 dark:text-white">Performa</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">All Pages</p>
        </div>
      </a>
      <p className="mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">Navigation</p>
      <nav className="mt-2 flex flex-col gap-0.5">
        {items.map((it, i) => (
          <a key={i} href={it.href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              it.active
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-white/90'
            }`}>
            <span className={it.active ? 'text-brand-500 dark:text-brand-300' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'}>{it.icon}</span>
            <span className="flex-1">{it.label}</span>
            {it.badge && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">{it.badge}</span>}
          </a>
        ))}
      </nav>
      <nav className="mt-4 flex flex-col gap-0.5 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.03]">
          <span className="text-gray-400">{Ico.cog}</span> Settings
        </button>
        <a href="My Account.html" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.03]">
          <span className="text-gray-400">{Ico.user}</span> My Account
        </a>
      </nav>
    </aside>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="relative hidden md:block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Ico.search}</span>
          <input type="text" placeholder="Search employees, templates, cycles…"
            className="h-10 w-80 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-16 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200 dark:placeholder:text-gray-500" />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">⌘K</kbd>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
            {Ico.bell}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error-500 ring-2 ring-white dark:ring-gray-900" />
          </button>
          <a href="My Account.html" className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-2 py-1.5 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
            <Av initials="AP" size="md" tone="brand" />
            <div className="hidden pr-2 text-left lg:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">Aqmal Pratama</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Software Engineer</p>
            </div>
            {Ico.chevDown}
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Page banner ─────────────────────────────────────────────────────────────
function PageBanner() {
  return (
    <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 dark:border-brand-500/20 dark:from-brand-500/10 dark:to-transparent">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M5 17l4-9 3 6 3-4 4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-300">System Overview</p>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Performance Management — Q1 2026</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">All pages · all data · one view &middot; {CYCLE.start} – {CYCLE.end}</p>
        </div>
        <div className="flex gap-3">
          <a href="KPI Dashboard.html" className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:bg-white/[0.08]">
            {Ico.dash} Employee view
          </a>
          <a href="HR Dashboard.html" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
            {Ico.bar} HR Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── HR Cycle Pipeline ────────────────────────────────────────────────────────
function CyclePipeline() {
  const stages = [
    { label: 'Invited',        val: HR_CYCLE.invited,       color: '#94a3b8' },
    { label: 'Draft started',  val: HR_CYCLE.draftStarted,  color: '#7592ff' },
    { label: 'Self submitted', val: HR_CYCLE.selfSubmitted, color: '#465fff' },
    { label: 'SL approved',    val: HR_CYCLE.slApproved,    color: '#7c5cff' },
    { label: 'HoD approved',   val: HR_CYCLE.hodApproved,   color: '#10b981' },
    { label: 'HoDiv approved', val: HR_CYCLE.hodivApproved, color: '#059669' },
    { label: 'Completed',      val: HR_CYCLE.completed,     color: '#047857' },
  ];
  const max = HR_CYCLE.invited;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <SectionHead
        label="Company-wide cycle pipeline"
        sub={`${CYCLE.name} · ${HR_CYCLE.totalEmployees} employees`}
        action={<a href="HR Dashboard.html" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">Full dashboard →</a>}
      />
      <div className="mt-5 flex flex-col gap-2.5">
        {stages.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <p className="w-32 shrink-0 text-right text-[12px] text-gray-500 dark:text-gray-400">{s.label}</p>
            <div className="h-7 flex-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex h-full items-center rounded-lg px-3 transition-all"
                style={{ width: `${Math.max(4, (s.val / max) * 100)}%`, background: s.color }}>
                <span className="text-[11px] font-semibold text-white">{s.val}</span>
              </div>
            </div>
            <p className="w-10 text-right text-[12px] font-semibold text-gray-700 dark:text-gray-300">{Math.round((s.val / max) * 100)}%</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:grid-cols-6">
        {[
          { label: 'Total',        val: HR_CYCLE.totalEmployees },
          { label: 'Self done',    val: HR_CYCLE.selfSubmitted },
          { label: 'SL approved',  val: HR_CYCLE.slApproved },
          { label: 'HoD approved', val: HR_CYCLE.hodApproved },
          { label: 'HoDiv',        val: HR_CYCLE.hodivApproved },
          { label: 'Completed',    val: HR_CYCLE.completed },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-[22px] font-bold leading-none text-gray-900 dark:text-white">{s.val}</p>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Employee Appraisal Card ──────────────────────────────────────────────────
function EmployeeAppraisalCard() {
  const stateIdx = STATUS_FLOW.findIndex(s => s.key === APPRAISAL_STATE);
  const selfAvg  = weightedAvg(KRAS, 'self');
  const slAvg    = weightedAvg(KRAS, 'sl');

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <SectionHead
        label="Employee appraisal"
        sub={`${EMPLOYEE.name} · ${CYCLE.name}`}
        action={<a href="KPI Dashboard.html" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">Open →</a>}
      />

      <div className="mt-4 flex flex-wrap items-start gap-4">
        <div className="flex items-center gap-3">
          <Av initials={EMPLOYEE.initials} size="lg" tone="brand" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{EMPLOYEE.name}</p>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">{EMPLOYEE.position} · {EMPLOYEE.squad}</p>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Pill tone="brand">{CYCLE.short}</Pill>
          <Pill tone="brand">{EMPLOYEE.department}</Pill>
          <Pill tone="gray">{EMPLOYEE.division}</Pill>
        </div>
      </div>

      {/* Status stepper */}
      <div className="mt-5 flex items-center overflow-x-auto pb-1">
        {STATUS_FLOW.map((s, i) => {
          const done   = i < stateIdx;
          const active = i === stateIdx;
          return (
            <React.Fragment key={s.key}>
              <div className="flex shrink-0 flex-col items-center gap-1.5 px-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  done   ? 'bg-success-500 text-white'
                  : active ? 'bg-brand-500 text-white ring-4 ring-brand-500/20'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                }`}>
                  {done ? <span style={{display:'flex'}}>{Ico.check}</span> : i + 1}
                </div>
                <p className={`whitespace-nowrap text-[11px] font-medium ${
                  done   ? 'text-success-600 dark:text-success-400'
                  : active ? 'text-brand-600 dark:text-brand-300'
                  : 'text-gray-400 dark:text-gray-500'
                }`}>{s.label}</p>
                <p className="max-w-[80px] truncate text-center text-[10px] text-gray-400 dark:text-gray-500">{s.actor}</p>
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={`h-px flex-1 ${done ? 'bg-success-300 dark:bg-success-700' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Reviewers */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[EMPLOYEE.squadLeader, EMPLOYEE.headOfDept, EMPLOYEE.headOfDivision].map((r, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-gray-100 p-3 dark:border-gray-800">
            <Av initials={r.initials} tone={i === 0 ? 'brand' : 'gray'} />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-gray-800 dark:text-white/90">{r.name}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{r.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Score summary */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/40">
          <p className="text-[28px] font-bold text-gray-900 dark:text-white">{selfAvg}</p>
          <p className="mt-0.5 text-[11px] text-gray-500">Self score (weighted)</p>
        </div>
        <div className="rounded-xl bg-brand-50 p-4 text-center dark:bg-brand-500/10">
          <p className="text-[28px] font-bold text-brand-700 dark:text-brand-300">{slAvg}</p>
          <p className="mt-0.5 text-[11px] text-brand-600 dark:text-brand-400">SL score (partial)</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/40">
          <p className="text-[28px] font-bold text-gray-400 dark:text-gray-500">—</p>
          <p className="mt-0.5 text-[11px] text-gray-500">Final score</p>
        </div>
      </div>
    </div>
  );
}

// ─── KRA Table ────────────────────────────────────────────────────────────────
function KRATable() {
  const fields = ['self','sl','hod','hodiv'];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <SectionHead label="KRA breakdown" sub={`${KRAS.length} key results · total weight 100%`} />
        <div className="flex gap-3">
          <a href="Self Appraisal.html" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">Self appraisal →</a>
          <a href="SL Review.html"      className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">SL review →</a>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">KRA</th>
              <th className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">Wt</th>
              {['Self','SL','HoD','HoDiv'].map(h => (
                <th key={h} className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {KRAS.map((k, i) => (
              <tr key={k.id} className={`border-b border-gray-100 dark:border-gray-800/60 ${i % 2 === 1 ? 'bg-gray-50/40 dark:bg-gray-800/10' : ''}`}>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800 dark:text-white/90">{k.title}</p>
                  <p className="text-[12px] text-gray-500">{k.target}</p>
                </td>
                <td className="px-3 py-4 text-center">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{k.weight}%</span>
                </td>
                {fields.map(f => {
                  const v = k[f];
                  return (
                    <td key={f} className="px-3 py-4 text-center">
                      {v != null && v > 0 ? (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBg(v)}`}>
                          {v} <span className="ml-1 hidden sm:inline">· {SCORE_LABELS[v]}</span>
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 dark:border-gray-700">
              <td className="px-6 py-4 text-[13px] font-semibold text-gray-700 dark:text-gray-200">Weighted average</td>
              <td className="px-3 py-4 text-center text-[13px] font-semibold text-gray-500">100%</td>
              {fields.map(f => {
                const avg = weightedAvg(KRAS, f);
                return (
                  <td key={f} className="px-3 py-4 text-center">
                    {avg !== '—'
                      ? <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${scoreBg(parseFloat(avg))}`}>{avg}</span>
                      : <span className="text-gray-300 dark:text-gray-600">—</span>
                    }
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ─── Division Table ───────────────────────────────────────────────────────────
function DivisionTable() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02] overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4">
        <SectionHead label="Division progress" sub="Completion vs cycle total" />
        <a href="HR Dashboard.html" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">Full view →</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30">
              {['Division','Total','Completed','In Review','Draft','Not started','Avg'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIVISIONS.map((d, i) => {
              const pct = Math.round((d.completed / d.total) * 100);
              return (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50/60 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-white/90">{d.name}</td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{d.total}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-success-600 dark:text-success-400">{d.completed}</span>
                      <div className="h-1.5 w-16 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-1.5 rounded-full bg-success-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-400">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-brand-600 dark:text-brand-400">{d.inReview}</td>
                  <td className="px-5 py-3.5 text-gray-500">{d.draft}</td>
                  <td className="px-5 py-3.5 text-gray-400">{d.notStarted}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${scoreBg(d.avg)}`}>{d.avg}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Attention + Recent ───────────────────────────────────────────────────────
function AttentionAndRecent() {
  const attTone = {
    error:   'border-error-200 bg-error-50 dark:border-error-500/20 dark:bg-error-500/10',
    warning: 'border-warning-200 bg-warning-50 dark:border-warning-500/20 dark:bg-warning-500/10',
    brand:   'border-brand-100 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/10',
  };
  const attIconEl = { x: Ico.x, warn: Ico.warn, bell: Ico.bell };
  const attIconCls = { error: 'text-error-500', warning: 'text-warning-500', brand: 'text-brand-500' };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
        <SectionHead label="Needs attention" sub="Items requiring HR action" />
        <div className="mt-4 flex flex-col gap-3">
          {ATTENTION.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${attTone[a.kind]}`}>
              <span className={`mt-0.5 shrink-0 ${attIconCls[a.kind]}`}>{attIconEl[a.icon]}</span>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{a.title}</p>
                <p className="mt-0.5 text-[12px] text-gray-500">{a.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
        <SectionHead label="Recent submissions" sub="Latest appraisal movements" />
        <div className="mt-4 flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {RECENT.map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Av initials={r.initials} tone={r.tone} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">{r.who}</p>
                <p className="text-[12px] text-gray-500">{r.team}</p>
              </div>
              <div className="shrink-0 text-right">
                <Pill tone={r.tone === 'success' ? 'success' : r.tone === 'warning' ? 'warning' : 'brand'}>{r.to}</Pill>
                <p className="mt-1 text-[11px] text-gray-400">{r.when}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Nav ────────────────────────────────────────────────────────────────
function QuickNav() {
  const pages = [
    { label: 'KPI Dashboard',   sub: 'Employee appraisal view',        href: 'KPI Dashboard.html',   icon: Ico.dash,     tone: 'brand' },
    { label: 'Self Appraisal',  sub: 'Fill in KRAs & self scores',     href: 'Self Appraisal.html',  icon: Ico.paper,    tone: 'brand' },
    { label: 'SL Review',       sub: 'Squad Leader score & submit',    href: 'SL Review.html',       icon: Ico.feedback, tone: 'brand' },
    { label: 'HoD Review',      sub: 'Head of Dept calibration',       href: 'HoD Review.html',      icon: Ico.team,     tone: 'brand' },
    { label: 'HoDiv Review',    sub: 'Head of Division final review',  href: 'HoDiv Review.html',    icon: Ico.layers,   tone: 'brand' },
    { label: 'HR Dashboard',    sub: 'Company-wide cycle tracker',     href: 'HR Dashboard.html',    icon: Ico.bar,      tone: 'success' },
    { label: 'Organization',    sub: 'Departments, teams & headcount', href: 'Organization.html',    icon: Ico.building, tone: 'success' },
    { label: 'KRA Templates',   sub: 'Role-based template library',    href: 'KRA Templates.html',   icon: Ico.layers,   tone: 'success' },
    { label: 'Cycles',          sub: 'Cycle management & history',     href: 'Cycles.html',          icon: Ico.clock,    tone: 'warning' },
    { label: 'Distribution',    sub: 'Invite & assign appraisals',     href: 'Distribution.html',    icon: Ico.send,     tone: 'warning' },
    { label: 'Reports',         sub: 'Export & analytics',             href: 'Reports.html',         icon: Ico.bar,      tone: 'warning' },
    { label: 'My Account',      sub: 'Profile & preferences',          href: 'My Account.html',      icon: Ico.user,     tone: 'gray' },
    { label: 'Login',           sub: 'Authentication page',            href: 'Login.html',           icon: Ico.link,     tone: 'gray' },
    { label: 'Forgot Password', sub: 'Password reset flow',            href: 'Forgot Password.html', icon: Ico.cog,      tone: 'gray' },
  ];
  const toneCls = {
    brand:   { icon: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300', ring: 'hover:border-brand-200 dark:hover:border-brand-500/30' },
    success: { icon: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300', ring: 'hover:border-success-200 dark:hover:border-success-500/30' },
    warning: { icon: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300', ring: 'hover:border-warning-200 dark:hover:border-warning-500/30' },
    gray:    { icon: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', ring: 'hover:border-gray-300 dark:hover:border-gray-600' },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <SectionHead label="All pages" sub="Quick navigation to every screen in the system" />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pages.map((p, i) => (
          <a key={i} href={p.href}
            className={`flex items-center gap-3 rounded-xl border border-gray-100 p-3.5 transition-all hover:shadow-sm dark:border-gray-800 ${toneCls[p.tone].ring}`}>
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneCls[p.tone].icon}`}>{p.icon}</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{p.label}</p>
              <p className="truncate text-[11px] text-gray-500">{p.sub}</p>
            </div>
            <span className="ml-auto shrink-0 text-gray-300 dark:text-gray-600">{Ico.chev}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function Overview() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <style>{`
        .bg-brand-500  { background-color: #465fff !important; }
        .bg-brand-600  { background-color: #3641f5 !important; }
        .hover\\:bg-brand-600:hover { background-color: #3641f5 !important; }
        .bg-brand-50   { background-color: #ecf3ff !important; }
        .text-brand-500 { color: #465fff !important; }
        .text-brand-600 { color: #3641f5 !important; }
        .text-brand-700 { color: #2a31d8 !important; }
        .text-brand-300 { color: #7592ff !important; }
        .text-brand-400 { color: #7592ff !important; }
        .border-brand-100 { border-color: #dde9ff !important; }
        .border-brand-200 { border-color: #c2d6ff !important; }
        .border-brand-300 { border-color: #9cb9ff !important; }
        .from-brand-50 { --tw-gradient-from: #ecf3ff !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
        .ring-brand-500\\/20 { --tw-ring-color: #465fff33 !important; }
        .focus\\:border-brand-300:focus { border-color: #9cb9ff !important; }
        .focus\\:ring-brand-500\\/10:focus { --tw-ring-color: #465fff1a !important; }
        html.dark .dark\\:bg-brand-500\\/10  { background-color: #465fff1a !important; }
        html.dark .dark\\:bg-brand-500\\/15  { background-color: #465fff26 !important; }
        html.dark .dark\\:text-brand-300    { color: #7592ff !important; }
        html.dark .dark\\:text-brand-400    { color: #7592ff !important; }
        html.dark .dark\\:border-brand-500\\/20 { border-color: #465fff33 !important; }
        html.dark .dark\\:border-brand-500\\/30 { border-color: #465fff4d !important; }
        html.dark .dark\\:from-brand-500\\/10 { --tw-gradient-from: #465fff1a !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
      `}</style>
      <div className="flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Header />
          <main className="flex flex-col gap-6 px-6 py-6 lg:px-8">
            <PageBanner />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <CyclePipeline />
              <EmployeeAppraisalCard />
            </div>
            <KRATable />
            <DivisionTable />
            <AttentionAndRecent />
            <QuickNav />
          </main>
        </div>
      </div>
    </div>
  );
}

const _overviewRoot = ReactDOM.createRoot(document.getElementById('root'));
_overviewRoot.render(<Overview />);
