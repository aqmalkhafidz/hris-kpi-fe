// dashboard.jsx — Performance Management dashboard for Aqmal (Software Engineer)
// Aligned to userflow Q1 2026 (2026-01-01 → 2026-03-31)
// Status flow: draft → sl_review → hod_review → hodiv_review → completed
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ─────────────────────────────────────────────────────────────────────────────
// TWEAK DEFAULTS (persisted via host)
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "darkMode": false,
  "density": "regular",
  "brandHue": "indigo",
  "role": "employee",
  "appraisalState": "draft"
}/*EDITMODE-END*/;

// brand color presets
const BRAND_PRESETS = {
  indigo:  { 50:'#ecf3ff',100:'#dde9ff',400:'#7592ff',500:'#465fff',600:'#3641f5',700:'#2a31d8' },
  teal:    { 50:'#effcf6',100:'#d4f6e6',400:'#34d39d',500:'#0bb583',600:'#089168',700:'#066d4f' },
  emerald: { 50:'#ecfdf5',100:'#d1fae5',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857' },
  violet:  { 50:'#f5f3ff',100:'#ede9fe',400:'#a78bfa',500:'#7c5cff',600:'#6940f0',700:'#5430cf' },
  orange:  { 50:'#fff5ec',100:'#ffe5cc',400:'#ff9a3c',500:'#f97316',600:'#dd5e0a',700:'#b14808' },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — Aligned to userflow.md
const USER = {
  name: 'Aqmal Pratama',
  initials: 'AP',
  position: 'Software Engineer',
  jobTitle: 'Engineer · IC2',
  squad: 'Cart & Checkout',
  department: 'Engineering',
  division: 'Technology',
  squadLeader:    { name: 'Rifky Oktaviano',  initials: 'RO' },
  headOfDept:     { name: 'Dewi Anggraeni',   initials: 'DA' },
  headOfDivision: { name: 'Bastian Wirajaya', initials: 'BW' },
};

const CYCLE = {
  name: 'Q1 2026 Appraisal',
  short: 'Q1 · 2026',
  start: 'Jan 1, 2026',
  end:   'Mar 31, 2026',
  endDate: new Date('2026-03-31'),
  template: 'Engineering · Software Engineer · v3',
};
// Today is 2026-04-26 per system info -> cycle has ended; we set "today" mid-cycle for realism.
const TODAY = new Date('2026-03-15');
const daysToEnd = Math.max(0, Math.round((CYCLE.endDate - TODAY) / 86400000));

// Status flow per userflow.md
const STATUS_FLOW = [
  { key: 'draft',        label: 'Draft',         actor: 'You' },
  { key: 'sl_review',    label: 'SL Review',     actor: USER.squadLeader.name },
  { key: 'hod_review',   label: 'HoD Review',    actor: USER.headOfDept.name },
  { key: 'hodiv_review', label: 'HoDiv Review',  actor: USER.headOfDivision.name },
  { key: 'completed',    label: 'Completed',     actor: 'HR' },
];

// Build initial KRAs (from template snapshot — total weight = 100)
const INITIAL_KRAS = [
  { id:'k1', title:'Reduce checkout P95 latency',
    description:'Bring P95 of /checkout below 220ms across our top 3 markets. Own the cart-service refactor and SLO tuning.',
    target:'P95 < 220ms', weight:25,
    self_score:4, self_comment:'Hit 248ms after cart refactor — 20% drop. Awaiting payment-rails work to fully close the gap.',
    evidence:[
      { kind:'url',  name:'Grafana dashboard · checkout P95', date:'Mar 10' },
      { kind:'file', name:'rfc-2026-checkout-rewrite.pdf',     date:'Feb 22' },
      { kind:'url',  name:'PR #4128 · cart-service v3',         date:'Feb 14' },
    ]},
  { id:'k2', title:'Migrate auth to OIDC provider',
    description:'Cut over remaining services from legacy session-cookie auth. Coordinate with SecOps on staged rollout.',
    target:'100% service rollout', weight:20,
    self_score:5, self_comment:'10 of 10 services migrated. Zero auth incidents in canary; full rollout completed Mar 4.',
    evidence:[
      { kind:'url',  name:'Rollout tracker · OIDC', date:'Mar 4' },
      { kind:'file', name:'oidc-postmortem.md',     date:'Mar 5' },
    ]},
  { id:'k3', title:'Ship Indonesia payment rails (DANA + GoPay)',
    description:'GA launch of two e-wallet rails. Vendor contract slipped 3 weeks; mitigation via parallel UAT.',
    target:'GA · DANA + GoPay', weight:20,
    self_score:3, self_comment:'DANA in beta, GoPay UAT pending vendor signoff. Slipped 3 weeks; mitigation plan in place.',
    evidence:[
      { kind:'url',  name:'JIRA epic · PAY-204', date:'Mar 12' },
    ]},
  { id:'k4', title:'Reduce on-call alerts by 30%',
    description:'Tune noisy SLOs and replace cron-driven alerts with anomaly detection on the order pipeline.',
    target:'≥ 30% reduction', weight:15,
    self_score:4, self_comment:'Reached 28% reduction. Two noisy alerts remain; tickets queued for Q2.',
    evidence:[
      { kind:'url',  name:'Alert quality report · Mar', date:'Mar 8' },
      { kind:'file', name:'slo-tuning-notes.md',         date:'Feb 28' },
    ]},
  { id:'k5', title:'Mentor 2 junior engineers',
    description:'Weekly 1:1 cadence + design-review shadowing. One mentee submitting promo packet this cycle.',
    target:'2 IC2 promotion-ready', weight:10,
    self_score:4, self_comment:'1 mentee promo-ready (committee Apr 5). Second on track for Q2.',
    evidence:[
      { kind:'file', name:'mentorship-log-q1.pdf', date:'Mar 14' },
    ]},
  { id:'k6', title:'Reduce flaky-test rate',
    description:'Quarantine + author-attribution job. Blocked on CI runner upgrade scheduled for May.',
    target:'Flake rate < 1%', weight:10,
    self_score:0, self_comment:'',
    evidence:[]},
];

const REFLECTION_INITIAL =
  'Strongest cycle so far on platform reliability — checkout latency and OIDC migration both landed near plan. ' +
  'Payment rails slipped due to vendor delay; lesson learned: lock vendor SLAs earlier in scoping.';

// Team Reviews (Squad Leader role surface)
const TEAM_REVIEWS = [
  { id:'tr1', name:'Naila Hakim',      position:'SE · Frontend', status:'sl_review',  submittedAt:'Mar 13', kraCount:6 },
  { id:'tr2', name:'Adit Surya',       position:'SE · Backend',  status:'sl_review',  submittedAt:'Mar 14', kraCount:6 },
  { id:'tr3', name:'Sherina Maulida',  position:'SE · Frontend', status:'draft',      submittedAt:'—',      kraCount:6 },
  { id:'tr4', name:'Bagas Pratomo',    position:'SE · Backend',  status:'hod_review', submittedAt:'Mar 9',  kraCount:6, completedByMe:true },
];

const ACTIVITIES = [
  { who:USER.headOfDept.name, avatar:USER.headOfDept.initials, what:'left a note on', target:'KRA: Indonesia payment rails', when:'2h ago', kind:'feedback' },
  { who:'You',                avatar:USER.initials,            what:'attached evidence to', target:'KRA: Migrate auth to OIDC', when:'Yesterday', kind:'evidence' },
  { who:'System',             avatar:'·',                       what:'distributed appraisal',  target:CYCLE.name, when:'Jan 8', kind:'system' },
  { who:USER.squadLeader.name,avatar:USER.squadLeader.initials, what:'reminded you to submit', target:'self-appraisal · Mar 28', when:'2d ago', kind:'reminder' },
  { who:'You',                avatar:USER.initials,             what:'updated reflection on', target:CYCLE.name,   when:'4d ago', kind:'update' },
];

// 4-cycle history for Aqmal (final_score / calibrated_score)
const CHART_SERIES = {
  filled: [
    { name:'Self score',       data:[3.6, 3.9, 4.1, 4.0] },
    { name:'Reviewer final',   data:[3.4, 3.7, 3.9, null] },
    { name:'Calibrated',       data:[3.5, 3.6, 3.7, null] },
  ],
  empty: [
    { name:'Self score',     data:[null, null, null, null] },
    { name:'Reviewer final', data:[null, null, null, null] },
    { name:'Calibrated',     data:[null, null, null, null] },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
const I = ({ d, className='h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">{d}</svg>
);
const Icon = {
  gauge:  <I d={<><path d="M12 4a8 8 0 1 0 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 12l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  target: <I d={<><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></>} />,
  review: <I d={<><path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  clock:  <I d={<><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  bell:   <I d={<><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  search: <I d={<><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  warn:   <I d={<><path d="M12 4 2.5 20h19L12 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 10v4M12 17v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  check:  <I d={<path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>} />,
  chev:   <I d={<path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  chevDown:<I d={<path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  arrowUp:<I d={<path d="M12 19V5m0 0-5 5m5-5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>} className="h-3.5 w-3.5" />,
  arrowDn:<I d={<path d="M12 5v14m0 0-5-5m5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>} className="h-3.5 w-3.5" />,
  dash:   <I d={<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>} />,
  goals:  <I d={<><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  reviews:<I d={<><path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 9h8M8 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  team:   <I d={<><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 19c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  feedback:<I d={<><path d="M4 5h16v10H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />,
  cog:    <I d={<><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.2-1.3L14 3h-4l-.4 2.4a7 7 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.2 1.3L10 21h4l.4-2.4a7 7 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></>} />,
  plus:   <I d={<path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>} />,
  doc:    <I d={<><path d="M6 3h9l4 4v14H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />,
  send:   <I d={<path d="M4 12 20 4l-3 16-5-7-8-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  filter: <I d={<path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  x:      <I d={<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>} />,
  paper:  <I d={<><path d="M5 3h11l3 3v15H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 11h8M8 14h6M8 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  link:   <I d={<><path d="M9 13a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 11a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  upload: <I d={<><path d="M12 4v12m0-12-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 16v4h14v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>} />,
  trash:  <I d={<><path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>} className="h-4 w-4" />,
  stack:  <I d={<><path d="M4 8l8-4 8 4-8 4-8-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m4 12 8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />,
};

// ─────────────────────────────────────────────────────────────────────────────
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

const STATUS_TONE = {
  draft:        'gray',
  sl_review:    'warning',
  hod_review:   'warning',
  hodiv_review: 'warning',
  completed:    'success',
};
function StatusBadge({ status }) {
  const item = STATUS_FLOW.find(s => s.key === status) || STATUS_FLOW[0];
  return <Badge tone={STATUS_TONE[status]}>{item.label}</Badge>;
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
function StatCard({ s }) {
  const tonebg = {
    brand:   'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400',
    success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400',
    info:    'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300',
  }[s.tone];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
         style={{ padding:'var(--pad-card)' }}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tonebg}`}>
        {Icon[s.icon]}
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
          <h3 className="mt-1.5 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white/90">{s.value}</span>
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">{s.sub}</span>
          </h3>
        </div>
        {s.trend && (
          <div className={`mb-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            s.trendUp ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
                     : 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400'}`}>
            {s.trendUp ? Icon.arrowUp : Icon.arrowDn}
            {s.trend}
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{s.foot}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
function Sidebar({ active, onNav, role }) {
  const isLeader = role === 'squad_leader';
  const items = [
    { id:'dashboard',    label:'Dashboard',     icon: Icon.dash },
    { id:'my_appraisal', label:'My Appraisals', icon: Icon.doc, badge: isLeader ? null : 'Q1' },
    { id:'self_appraisal', label:'Self Appraisal', icon: Icon.paper, href:'Self Appraisal.html' },
    ...(isLeader ? [{ id:'team_reviews', label:'Team Reviews', icon: Icon.team, badge:'2', tone:'warning' }] : []),
    { id:'cycles',       label:'Cycles',        icon: Icon.clock },
    { id:'feedback',     label:'Feedback',      icon: Icon.feedback },
    { id:'evidence',     label:'My Evidence',   icon: Icon.paper },
  ];
  const settings = [
    { id:'settings', label:'Settings', icon: Icon.cog },
  ];
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-gray-900 lg:flex">
      <div className="flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M5 17l4-9 3 6 3-4 4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-gray-800 dark:text-white">Performa</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Performance · v3.2</p>
        </div>
      </div>

      <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">Menu</p>
      <nav className="mt-2 flex flex-col gap-1">
        {items.map(it => {
          const isActive = it.id === active;
          const Tag = it.href ? 'a' : 'button';
          const navProps = it.href ? { href: it.href } : { onClick: () => onNav(it.id) };
          return (
            <Tag key={it.id} {...navProps}
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
                  it.tone === 'warning'
                    ? 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400'
                    : isActive
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>{it.badge}</span>
              )}
            </Tag>
          );
        })}
      </nav>

      <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">Other</p>
      <nav className="mt-2 flex flex-col gap-1">
        {settings.map(it => (
          <button key={it.id} onClick={() => onNav(it.id)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.03]">
            <span className="text-gray-400 dark:text-gray-500">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-white p-4 dark:border-gray-800 dark:from-brand-500/10 dark:to-transparent">
          <p className="text-xs font-semibold text-gray-800 dark:text-white/90">{CYCLE.name}</p>
          <p className="mt-1 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
            Cycle ends {CYCLE.end} · {daysToEnd} days left
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white dark:bg-gray-900">
            <div className="h-full bg-brand-500" style={{ width:'82%' }} />
          </div>
        </div>
        <a href="HR Dashboard.html" className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300 dark:hover:bg-brand-500/10 dark:hover:text-brand-300">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><path d="M5 21V5a2 2 0 0 1 2-2h7v18M14 21V9h5v12M5 21h17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </span>
          <span className="flex-1">Switch to HR Console</span>
          <span className="text-gray-400">→</span>
        </a>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER
function Header({ onOpenAppraisal, role }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="relative hidden md:block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {Icon.search}
          </span>
          <input
            type="text"
            placeholder="Search KRAs, cycles, reviews…"
            className="h-10 w-80 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-16 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200 dark:placeholder:text-gray-500" />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">⌘K</kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={onOpenAppraisal} className="hidden items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 sm:inline-flex">
            {Icon.doc}
            <span>Open self-appraisal</span>
          </button>
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
            {Icon.bell}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error-500 ring-2 ring-white dark:ring-gray-900" />
          </button>
          <div className="ml-2 flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-2 py-1.5 dark:border-gray-800 dark:bg-white/[0.03]">
            <Avatar initials={USER.initials} size="md" tone="brand" />
            <div className="hidden pr-2 text-left lg:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{USER.name}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {role === 'squad_leader' ? 'Squad Leader · Cart & Checkout' : USER.position}
              </p>
            </div>
            <span className="hidden pr-1 text-gray-400 lg:block">{Icon.chevDown}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART
function QuarterlyChart({ filled, dark, brand }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !window.ApexCharts) return;
    const series = filled ? CHART_SERIES.filled : CHART_SERIES.empty;
    const opts = {
      chart: { type:'line', height: 320, fontFamily:'Inter, sans-serif', toolbar:{ show:false }, zoom:{ enabled:false }, animations:{ easing:'easeOutCubic', speed:500 } },
      series,
      colors: [brand[500], '#12b76a', '#94a3b8'],
      stroke: { curve:'smooth', width:[3,3,2], dashArray:[0,0,4] },
      fill: { type:'gradient', gradient:{ opacityFrom:0.25, opacityTo:0, stops:[0,90] } },
      markers: { size:[5,5,0], strokeWidth:2, strokeColors: dark ? '#0f1322' : '#fff', hover:{ sizeOffset:3 } },
      grid: { borderColor: dark ? 'rgba(148,163,184,0.12)' : '#eef2f7', strokeDashArray:4, padding:{ left:8, right:8 } },
      xaxis: {
        categories: ['Q2 ’25','Q3 ’25','Q4 ’25','Q1 ’26'],
        axisBorder:{ show:false }, axisTicks:{ show:false },
        labels:{ style:{ colors: dark ? '#94a3b8' : '#64748b', fontSize:'12px', fontWeight:500 } },
      },
      yaxis: { min:0, max:5, tickAmount:5,
        labels:{ style:{ colors: dark ? '#94a3b8' : '#64748b', fontSize:'12px' }, formatter:(v)=>v.toFixed(1) } },
      legend: { position:'top', horizontalAlign:'right', fontSize:'12px', fontWeight:500,
        labels:{ colors: dark ? '#cbd5e1' : '#475569' }, markers:{ size:5 } },
      tooltip: { theme: dark ? 'dark' : 'light', y:{ formatter:(v)=> v==null?'—':v.toFixed(1)+' / 5.0' } },
      dataLabels: { enabled:false },
    };
    if (chartRef.current) {
      chartRef.current.updateOptions(opts, true, true);
    } else {
      chartRef.current = new ApexCharts(ref.current, opts);
      chartRef.current.render();
    }
  }, [filled, dark, brand]);

  useEffect(() => () => { chartRef.current?.destroy?.(); chartRef.current = null; }, []);

  return <div ref={ref} className="w-full overflow-hidden" style={{ minHeight: 320 }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// KRA ROW (read view on dashboard)
function KRARow({ k, expanded, onToggle, onEdit }) {
  const filled = k.self_score > 0;
  const tone = !filled ? 'gray' : k.self_score >= 4 ? 'success' : k.self_score >= 3 ? 'warning' : 'error';
  const bar  = !filled ? 'bg-gray-300 dark:bg-gray-700' : tone === 'success' ? 'bg-success-500' : tone === 'warning' ? 'bg-warning-500' : 'bg-error-500';
  const pct  = filled ? (k.self_score / 5) * 100 : 0;

  return (
    <div className="border-b border-gray-200 last:border-b-0 dark:border-gray-800">
      <button onClick={onToggle}
        className="flex w-full items-center gap-4 text-left hover:bg-gray-50 dark:hover:bg-white/[0.02]"
        style={{ padding:'var(--row-pad) 1.25rem' }}>
        <span className="grid h-9 w-12 shrink-0 place-items-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">{k.weight}%</span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">{k.title}</p>
            {filled
              ? <Badge tone={tone}>Self {k.self_score}/5</Badge>
              : <Badge tone="warning">Score required</Badge>}
            <Badge tone="gray">{k.evidence.length} evidence</Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
            Target: <span className="font-medium text-gray-700 dark:text-gray-300">{k.target}</span>
          </p>
        </div>

        <div className="hidden w-44 shrink-0 sm:block">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Self score</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">{filled ? `${k.self_score}/5` : '—'}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className={`h-full ${bar} transition-all`} style={{ width:`${pct}%` }} />
          </div>
        </div>

        <span className={`text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}>{Icon.chev}</span>
      </button>

      {expanded && (
        <div className="border-t border-dashed border-gray-200 bg-gray-50/50 px-5 py-4 dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{k.description}</p>

              {filled && (
                <>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Your comment</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{k.self_comment}</p>
                </>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={onEdit}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
                  {filled ? 'Edit in self-appraisal' : 'Score & comment'}
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">
                  {Icon.upload} Add evidence
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Evidence ({k.evidence.length})</p>
              {k.evidence.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No evidence yet — add a link or upload (max 5 MB).</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {k.evidence.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-gray-400">{e.kind === 'url' ? Icon.link : Icon.paper}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800 dark:text-white/90">{e.name}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{e.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APPROVAL STEPS TIMELINE — Visual representation of status flow
function ApprovalSteps({ status }) {
  const idx = STATUS_FLOW.findIndex(s => s.key === status);
  return (
    <ol className="grid grid-cols-5 gap-0">
      {STATUS_FLOW.map((s, i) => {
        const done = i < idx;
        const current = i === idx;
        const tone = done ? 'bg-success-500 text-white border-success-500'
                   : current ? 'bg-brand-500 text-white border-brand-500 ring-4 ring-brand-500/15'
                   : 'bg-white text-gray-400 border-gray-300 dark:bg-gray-900 dark:border-gray-700';
        const lineDone = i < idx;
        return (
          <li key={s.key} className="relative flex flex-col items-center">
            {i > 0 && (
              <span className={`absolute right-1/2 top-3 h-0.5 w-full -translate-y-1/2 ${
                lineDone ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-800'
              }`} />
            )}
            <span className={`relative grid h-7 w-7 place-items-center rounded-full border-2 text-[11px] font-semibold ${tone}`}>
              {done ? Icon.check : i + 1}
            </span>
            <p className={`mt-2 text-center text-[11px] font-semibold ${
              current ? 'text-brand-700 dark:text-brand-300'
              : done   ? 'text-gray-700 dark:text-gray-300'
                       : 'text-gray-400 dark:text-gray-500'
            }`}>{s.label}</p>
            <p className="text-center text-[10px] text-gray-400 dark:text-gray-500">{s.actor}</p>
          </li>
        );
      })}
    </ol>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SELF-APPRAISAL DRAWER (full form per userflow §5)
function AppraisalDrawer({ open, onClose, kras, setKras, reflection, setReflection, status, onSaveDraft, onSubmitFinal }) {
  const [activeKraId, setActiveKraId] = useState(kras[0]?.id);
  const [showReflection, setShowReflection] = useState(false);
  useEffect(() => { if (open) { setActiveKraId(kras[0]?.id); setShowReflection(false); } }, [open]);

  if (!open) return null;

  const totalWeight = kras.reduce((a,k)=>a+k.weight, 0);
  const filledKras = kras.filter(k => k.self_score > 0);
  const allScored = kras.every(k => k.self_score > 0);
  const submitDisabled = !allScored || status !== 'draft';

  const updateKra = (id, patch) => setKras(prev => prev.map(k => k.id === id ? { ...k, ...patch } : k));
  const active = kras.find(k => k.id === activeKraId);

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto flex h-full w-full max-w-5xl flex-col bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">Self-Appraisal · {CYCLE.short}</p>
            <h3 className="mt-0.5 text-lg font-semibold text-gray-800 dark:text-white/90">{CYCLE.name}</h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Template: {CYCLE.template} · KRA weight total {totalWeight}%</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.05]">
              {Icon.x}
            </button>
          </div>
        </div>

        {/* Approval steps */}
        <div className="shrink-0 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <ApprovalSteps status={status} />
        </div>

        {/* Body — KRA list (left) + form (right) */}
        <div className="flex flex-1 min-h-0">
          {/* KRA sidebar */}
          <div className="w-72 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-white/[0.02]">
            <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              KRA list · {filledKras.length}/{kras.length} scored
            </p>
            {kras.map(k => {
              const filled = k.self_score > 0;
              const isActive = k.id === activeKraId;
              return (
                <button key={k.id} onClick={() => { setActiveKraId(k.id); setShowReflection(false); }}
                  className={`mb-1.5 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'bg-white shadow-sm ring-1 ring-brand-500/30 dark:bg-gray-900 dark:ring-brand-500/40'
                      : 'hover:bg-white dark:hover:bg-white/[0.03]'
                  }`}>
                  <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                    filled
                      ? 'bg-success-500 text-white'
                      : 'border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-700'
                  }`}>{filled ? Icon.check : ''}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{k.title}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                      Weight {k.weight}% · {filled ? `Score ${k.self_score}/5` : 'Score required'}
                    </p>
                  </div>
                </button>
              );
            })}

            <button onClick={() => setShowReflection(true)}
              className={`mt-2 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                showReflection
                  ? 'bg-white shadow-sm ring-1 ring-brand-500/30 dark:bg-gray-900 dark:ring-brand-500/40'
                  : 'hover:bg-white dark:hover:bg-white/[0.03]'
              }`}>
              <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                reflection.trim().length > 0
                  ? 'bg-success-500 text-white'
                  : 'border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-700'
              }`}>{reflection.trim().length > 0 ? Icon.check : ''}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-700 dark:text-gray-300">Employee reflection</p>
                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">Closing narrative</p>
              </div>
            </button>
          </div>

          {/* Right pane */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!showReflection && active && (
              <KRAForm k={active} disabled={status !== 'draft'} onChange={(p)=>updateKra(active.id, p)} />
            )}
            {showReflection && (
              <ReflectionForm value={reflection} disabled={status !== 'draft'} onChange={setReflection} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {status === 'draft'
              ? <>Saving as you type · last saved <span className="font-medium text-gray-700 dark:text-gray-300">2 min ago</span></>
              : <>Submitted — review in progress with {STATUS_FLOW.find(s => s.key === status)?.actor}</>
            }
          </div>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
              Close
            </button>
            <button onClick={onSaveDraft} disabled={status !== 'draft'}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
              Save draft
            </button>
            <button onClick={onSubmitFinal} disabled={submitDisabled}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
              {Icon.send} Submit final
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KRAForm({ k, disabled, onChange }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">KRA · weight {k.weight}%</p>
          <h4 className="mt-1 text-xl font-bold text-gray-800 dark:text-white/90">{k.title}</h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Target: <span className="font-medium text-gray-700 dark:text-gray-300">{k.target}</span></p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description (from template)</p>
        <p className="mt-1.5 leading-relaxed">{k.description}</p>
      </div>

      {/* Self score */}
      <div className="mt-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Self score <span className="text-error-500">*</span>
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[1,2,3,4,5].map(n => (
            <button key={n} disabled={disabled}
              onClick={() => onChange({ self_score: n })}
              className={`flex flex-col items-center justify-center rounded-xl border py-3 transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                k.self_score === n
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:bg-brand-500/10'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
              }`}>
              <span className={`text-2xl font-bold ${k.self_score===n?'text-brand-600 dark:text-brand-300':'text-gray-700 dark:text-gray-300'}`}>{n}</span>
              <span className="mt-1 text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {['Below','Partial','Meets','Exceeds','Outstanding'][n-1]}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-gray-400">Required to submit final.</p>
      </div>

      {/* Comment */}
      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Self comment</label>
        <textarea
          value={k.self_comment} onChange={(e)=>onChange({ self_comment: e.target.value })}
          disabled={disabled}
          rows={4}
          placeholder="What did you deliver against this KRA? Numbers, links, lessons learned…"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
        <p className="mt-1 text-xs text-gray-400">{k.self_comment.length} / 1000</p>
      </div>

      {/* Evidence */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Evidence <span className="text-gray-400 font-normal">({k.evidence.length})</span>
          </label>
          <span className="text-xs text-gray-400">URL or file · max 5 MB</span>
        </div>
        <div className="mt-2 space-y-2">
          {k.evidence.map((e, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-800 dark:bg-white/[0.03]">
              <span className={`grid h-9 w-9 place-items-center rounded-lg ${
                e.kind === 'url'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300'
                  : 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300'
              }`}>{e.kind === 'url' ? Icon.link : Icon.paper}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">{e.name}</p>
                <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                  {e.kind === 'url'
                    ? <>URL{e.url ? ` · ${e.url}` : ''} · added {e.date}</>
                    : <>File{e.size ? ` · ${e.size}` : ''} · added {e.date}</>}
                </p>
              </div>
              {!disabled && (
                <button onClick={()=>onChange({ evidence: k.evidence.filter((_,j)=>j!==i) })}
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-error-500 dark:hover:bg-white/[0.05]">
                  {Icon.trash}
                </button>
              )}
            </div>
          ))}
          {!disabled && (
            <EvidenceAdder onAdd={(item)=>onChange({ evidence:[...k.evidence, item] })} />
          )}
        </div>
      </div>
    </div>
  );
}

// Evidence adder — URL input + file upload drop zone
function EvidenceAdder({ onAdd }) {
  const [mode, setMode] = useState(null); // null | 'url' | 'file'
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);

  const reset = () => { setMode(null); setUrl(''); setLabel(''); };

  const submitUrl = () => {
    if (!url.trim()) return;
    let safe = url.trim();
    if (!/^https?:\/\//i.test(safe)) safe = 'https://' + safe;
    onAdd({ kind:'url', name: label.trim() || safe, url: safe, date:'today' });
    reset();
  };

  const onFiles = (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    list.forEach(f => {
      if (f.size > 5 * 1024 * 1024) {
        alert(`${f.name} is over 5 MB — please pick a smaller file.`);
        return;
      }
      onAdd({
        kind:'file',
        name: f.name,
        size: `${(f.size/1024).toFixed(0)} KB`,
        mime: f.type || 'application/octet-stream',
        date: 'today',
      });
    });
    reset();
  };

  if (mode === 'url') {
    return (
      <div className="space-y-2 rounded-xl border border-brand-200 bg-brand-50/40 p-3 dark:border-brand-500/30 dark:bg-brand-500/5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">Add evidence URL</p>
          <button onClick={reset} className="rounded p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{Icon.x}</button>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
          <span className="text-gray-400">{Icon.link}</span>
          <input autoFocus value={url} onChange={e=>setUrl(e.target.value)}
            onKeyDown={e=>{ if (e.key === 'Enter') submitUrl(); }}
            placeholder="https://grafana.internal/d/checkout-p95"
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white/90" />
        </div>
        <input value={label} onChange={e=>setLabel(e.target.value)}
          placeholder="Label (optional) — e.g. Checkout P95 dashboard"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={reset} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]">Cancel</button>
          <button onClick={submitUrl} disabled={!url.trim()}
            className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            Add link
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'file') {
    return (
      <div className="space-y-2 rounded-xl border border-brand-200 bg-brand-50/40 p-3 dark:border-brand-500/30 dark:bg-brand-500/5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">Upload evidence file</p>
          <button onClick={reset} className="rounded p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{Icon.x}</button>
        </div>
        <div
          onDragOver={(e)=>{ e.preventDefault(); setDrag(true); }}
          onDragLeave={()=>setDrag(false)}
          onDrop={(e)=>{ e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
          onClick={()=>fileRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
            drag
              ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10'
              : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50/30 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500/40'
          }`}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">{Icon.upload}</span>
          <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
            {drag ? 'Drop to upload' : 'Drop file here, or click to browse'}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">PDF, DOC, XLS, PNG · max 5 MB</p>
          <input ref={fileRef} type="file" multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.md,.txt"
            onChange={(e)=>onFiles(e.target.files)}
            className="hidden" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button onClick={()=>setMode('url')}
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5 dark:hover:text-brand-300">
        <span className="text-gray-400">{Icon.link}</span> Add URL
      </button>
      <button onClick={()=>setMode('file')}
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5 dark:hover:text-brand-300">
        <span className="text-gray-400">{Icon.upload}</span> Upload file
      </button>
    </div>
  );
}

function ReflectionForm({ value, disabled, onChange }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">Closing narrative</p>
      <h4 className="mt-1 text-xl font-bold text-gray-800 dark:text-white/90">Employee reflection</h4>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Step back from the KRAs — overall, how did this cycle go for you?</p>

      <textarea
        value={value} onChange={(e)=>onChange(e.target.value)}
        disabled={disabled}
        rows={12}
        placeholder="Highlights, challenges, growth areas, what you'd do differently next cycle…"
        className="mt-5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
      <p className="mt-1 text-xs text-gray-400">{value.length} / 4000</p>

      <div className="mt-5 rounded-xl border border-warning-200 bg-warning-50 p-3.5 text-sm dark:border-warning-800/50 dark:bg-warning-500/10">
        <p className="font-semibold text-warning-800 dark:text-warning-300">Before you submit</p>
        <p className="mt-0.5 text-warning-700 dark:text-warning-400">
          Once submitted final, this appraisal will route to {USER.squadLeader.name} (SL) → {USER.headOfDept.name} (HoD) → {USER.headOfDivision.name} (HoDiv).
          You won't be able to edit from <span className="font-semibold">My Appraisals</span> after submission.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
function Toast({ msg, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [msg, onClose]);
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm font-medium text-success-800 shadow-lg dark:border-success-800/50 dark:bg-success-500/15 dark:text-success-200">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-success-500 text-white">{Icon.check}</span>
        {msg}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = useState('dashboard');
  const [expandedKra, setExpandedKra] = useState('k1');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [kras, setKras] = useState(INITIAL_KRAS);
  const [reflection, setReflection] = useState(REFLECTION_INITIAL);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const brand = BRAND_PRESETS[t.brandHue] || BRAND_PRESETS.indigo;
  const status = t.appraisalState; // draft | sl_review | hod_review | hodiv_review | completed

  useEffect(() => {
    document.documentElement.classList.toggle('dark', !!t.darkMode);
  }, [t.darkMode]);

  // Stats — derived from current state
  const filledCount = kras.filter(k => k.self_score > 0).length;
  const weightedSelf = kras.reduce((acc, k) => acc + (k.self_score / 5) * k.weight, 0);
  const stats = [
    { label:'Self score (live)', value: weightedSelf > 0 ? weightedSelf.toFixed(1) : '—', sub:'/100',
      foot: filledCount === kras.length ? 'All KRAs scored' : `${filledCount}/${kras.length} KRAs scored`,
      icon:'gauge', tone:'brand' },
    { label:'Appraisal status', value: STATUS_FLOW.find(s=>s.key===status).label,
      foot: status==='completed' ? 'HR will calibrate next' : `Currently with ${STATUS_FLOW.find(s=>s.key===status).actor}`,
      icon:'review', tone: status==='completed' ? 'success' : status==='draft' ? 'warning' : 'info' },
    { label:'Evidence attached', value: kras.reduce((a,k)=>a+k.evidence.length, 0), sub:'items',
      foot:'Across all KRAs', icon:'target', tone:'success' },
    { label:'Days to cycle end', value: daysToEnd, sub:'days',
      foot:`${CYCLE.end} · submission window`, icon:'clock', tone:'info' },
  ];

  const onSaveDraft = () => setToast('Draft saved.');
  const onSubmitFinal = () => {
    setTweak('appraisalState', 'sl_review');
    setDrawerOpen(false);
    setToast(`Submitted to ${USER.squadLeader.name} (Squad Leader).`);
  };

  const densityClass = t.density === 'compact' ? 'density-compact' : t.density === 'roomy' ? 'density-roomy' : '';
  const isLeader = t.role === 'squad_leader';

  return (
    <div className={`min-h-screen ${densityClass}`}>
      {/* Brand color override stylesheet */}
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
        .ring-brand-500\\/15 { --tw-ring-color: ${brand[500]}26 !important; }
        .ring-brand-500\\/20 { --tw-ring-color: ${brand[500]}33 !important; }
        .ring-brand-500\\/30 { --tw-ring-color: ${brand[500]}4d !important; }
        .focus\\:border-brand-500:focus { border-color: ${brand[500]} !important; }
        .focus\\:ring-brand-500\\/10:focus { --tw-ring-color: ${brand[500]}1a !important; }
        .from-brand-50 { --tw-gradient-from: ${brand[50]} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
        html.dark .dark\\:bg-brand-500\\/5  { background-color: ${brand[500]}0d !important; }
        html.dark .dark\\:bg-brand-500\\/10 { background-color: ${brand[500]}1a !important; }
        html.dark .dark\\:bg-brand-500\\/15 { background-color: ${brand[500]}26 !important; }
        html.dark .dark\\:bg-brand-500\\/20 { background-color: ${brand[500]}33 !important; }
        html.dark .dark\\:text-brand-300 { color: ${brand[400]} !important; }
        html.dark .dark\\:text-brand-400 { color: ${brand[400]} !important; }
        html.dark .dark\\:text-brand-200 { color: ${brand[100]} !important; }
        html.dark .dark\\:from-brand-500\\/10 { --tw-gradient-from: ${brand[500]}1a !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent) !important; }
        html.dark .dark\\:ring-brand-500\\/30 { --tw-ring-color: ${brand[500]}4d !important; }
        html.dark .dark\\:ring-brand-500\\/40 { --tw-ring-color: ${brand[500]}66 !important; }
      `}</style>

      <div className="flex">
        <Sidebar active={active} onNav={setActive} role={t.role} />

        <div className="min-w-0 flex-1">
          <Header onOpenAppraisal={() => setDrawerOpen(true)} role={t.role} />

          <main className="px-6 py-6 lg:px-8" style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
            {/* Breadcrumb + page title */}
            <div className="flex flex-col gap-1">
              <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span>Home</span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-gray-700 dark:text-gray-300">My Appraisals</span>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="font-medium text-gray-800 dark:text-white/90">{CYCLE.short}</span>
              </nav>
              <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                    Hello, {USER.name.split(' ')[0]}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {USER.position} · {USER.squad} · {USER.department}
                    <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
                    {CYCLE.name} runs <span className="font-medium text-gray-700 dark:text-gray-300">{CYCLE.start}</span> – <span className="font-medium text-gray-700 dark:text-gray-300">{CYCLE.end}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
                    {Icon.filter} {CYCLE.short}
                    <span className="text-gray-400">{Icon.chevDown}</span>
                  </button>
                  <button onClick={()=>setDrawerOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 sm:hidden">
                    {Icon.doc} Open
                  </button>
                </div>
              </div>
            </div>

            {/* Action required banner — shows only while in draft */}
            {!bannerDismissed && status === 'draft' && (
              <div className="rounded-2xl border border-warning-200 bg-warning-50 px-4 py-4 dark:border-warning-800/50 dark:bg-warning-500/10 sm:px-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning-500 text-white">
                      {Icon.warn}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-warning-800 dark:text-warning-300">
                        Action required · Submit self-appraisal before {CYCLE.end}
                      </h3>
                      <p className="mt-1 text-sm text-warning-700 dark:text-warning-400">
                        {kras.length - filledCount > 0
                          ? `${kras.length - filledCount} of ${kras.length} KRAs still need a self-score.`
                          : 'All KRAs scored — review your reflection and submit final.'}
                        {' '}Once submitted, it routes to {USER.squadLeader.name} → {USER.headOfDept.name} → {USER.headOfDivision.name}.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:shrink-0">
                    <button onClick={()=>setBannerDismissed(true)} className="rounded-xl px-3 py-2 text-sm font-semibold text-warning-700 hover:bg-warning-100 dark:text-warning-300 dark:hover:bg-warning-500/10">
                      Remind me later
                    </button>
                    <button onClick={()=>setDrawerOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-warning-300 bg-white px-4 py-2.5 text-sm font-semibold text-warning-700 hover:bg-warning-100 dark:border-warning-800/60 dark:bg-warning-500/5 dark:text-warning-300">
                      Continue self-appraisal {Icon.chev}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submitted banner */}
            {!bannerDismissed && status !== 'draft' && status !== 'completed' && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 dark:border-blue-800/50 dark:bg-blue-500/10 sm:px-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">
                      {Icon.review}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                        Submitted · in review with {STATUS_FLOW.find(s=>s.key===status).actor}
                      </h3>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                        Your appraisal is now <StatusBadge status={status} />. You'll be notified when the next reviewer takes action.
                      </p>
                    </div>
                  </div>
                  <button onClick={()=>setDrawerOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-800/60 dark:bg-blue-500/5 dark:text-blue-300">
                    View submission
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" style={{ gap:'var(--gap)' }}>
              {stats.map((s, i) => <StatCard key={i} s={s} />)}
            </div>

            {/* Approval steps + chart row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ gap:'var(--gap)' }}>
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2"
                   style={{ padding:'var(--pad-card)' }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Performance history</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Self vs reviewer-final vs HR-calibrated, last 4 quarters.</p>
                  </div>
                  <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-white/[0.03]">
                    {['1Y','2Y','All'].map((l, i) => (
                      <button key={l} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        i === 0
                          ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-900 dark:text-white/90'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <QuarterlyChart filled={true} dark={t.darkMode} brand={brand} />
                </div>
              </div>

              {/* Approval steps panel */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
                   style={{ padding:'var(--pad-card)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Approval flow</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Routing for {CYCLE.short}.</p>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <ol className="mt-5 space-y-4">
                  {STATUS_FLOW.map((s, i) => {
                    const idx = STATUS_FLOW.findIndex(x => x.key === status);
                    const done = i < idx;
                    const current = i === idx;
                    return (
                      <li key={s.key} className="flex gap-3">
                        <div className="relative">
                          <span className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold ${
                            done    ? 'bg-success-500 text-white' :
                            current ? 'bg-brand-500 text-white ring-4 ring-brand-500/15' :
                                      'border-2 border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900'
                          }`}>{done ? Icon.check : i+1}</span>
                          {i < STATUS_FLOW.length - 1 && (
                            <span className={`absolute left-1/2 top-8 h-7 w-0.5 -translate-x-1/2 ${
                              done ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-800'
                            }`} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                          <p className={`text-sm font-semibold ${
                            current ? 'text-gray-900 dark:text-white' :
                            done    ? 'text-gray-700 dark:text-gray-300' :
                                      'text-gray-500 dark:text-gray-500'
                          }`}>{s.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{s.actor}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* KRAs list */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">My KRAs · {CYCLE.short}</h3>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">From template snapshot · weight total {kras.reduce((a,k)=>a+k.weight,0)}%</p>
                </div>
                <button onClick={()=>setDrawerOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                  {Icon.doc} {status === 'draft' ? 'Continue self-appraisal' : 'View submission'}
                </button>
              </div>
              <div>
                {kras.map(k => (
                  <KRARow key={k.id} k={k}
                    expanded={expandedKra === k.id}
                    onToggle={() => setExpandedKra(expandedKra === k.id ? null : k.id)}
                    onEdit={() => setDrawerOpen(true)} />
                ))}
              </div>
            </div>

            {/* Team Reviews — Squad Leader only */}
            {isLeader && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Team Reviews</h3>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Action required as Squad Leader · Cart & Checkout</p>
                  </div>
                  <Badge tone="warning">{TEAM_REVIEWS.filter(x => x.status === 'sl_review').length} pending</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Subordinate</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">KRAs</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Submitted</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {TEAM_REVIEWS.map(tr => (
                        <tr key={tr.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar initials={tr.name.split(' ').map(s=>s[0]).slice(0,2).join('')} tone="brand" size="md" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{tr.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{tr.position}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">{tr.kraCount}</td>
                          <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">{tr.submittedAt}</td>
                          <td className="px-5 py-3"><StatusBadge status={tr.status} /></td>
                          <td className="px-5 py-3 text-right">
                            {tr.status === 'sl_review' ? (
                              <a href="SL Review.html" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
                                Review now {Icon.chev}
                              </a>
                            ) : tr.status === 'hod_review' && !tr.completedByMe ? (
                              <a href="HoD Review.html" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
                                Review now {Icon.chev}
                              </a>
                            ) : tr.status === 'draft' ? (
                              <span className="text-xs text-gray-400">Awaiting submit</span>
                            ) : (
                              <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
                                View history
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Activity + summary */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ gap:'var(--gap)' }}>
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-2"
                   style={{ padding:'var(--pad-card)' }}>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent activity</h3>
                  <button className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300">View all</button>
                </div>
                <ol className="mt-4 space-y-4">
                  {ACTIVITIES.map((a, i) => (
                    <li key={i} className="flex gap-3">
                      <Avatar initials={a.avatar} tone={
                        a.kind === 'feedback' ? 'success' :
                        a.kind === 'evidence' ? 'brand' :
                        a.kind === 'reminder' ? 'warning' :
                        a.kind === 'system'   ? 'gray'    : 'gray'
                      } size="md" />
                      <div className="min-w-0 flex-1 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 dark:border-gray-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-semibold text-gray-800 dark:text-white/90">{a.who}</span>{' '}{a.what}{' '}
                          <span className="font-medium text-brand-600 dark:text-brand-300">{a.target}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{a.when}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
                   style={{ padding:'var(--pad-card)' }}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Cycle summary</h3>
                <dl className="mt-4 space-y-3.5">
                  {[
                    ['Cycle',         CYCLE.name],
                    ['Period',        `${CYCLE.start} – ${CYCLE.end}`],
                    ['Template',      CYCLE.template],
                    ['Squad Leader',  USER.squadLeader.name],
                    ['HoD',           USER.headOfDept.name],
                    ['HoDiv',         USER.headOfDivision.name],
                  ].map(([k,v]) => (
                    <div key={k} className="flex items-start justify-between gap-3 border-b border-dashed border-gray-200 pb-3 last:border-b-0 last:pb-0 dark:border-gray-800">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">{k}</dt>
                      <dd className="text-right text-sm font-semibold text-gray-800 dark:text-white/90">{v}</dd>
                    </div>
                  ))}
                </dl>
                <button onClick={()=>setDrawerOpen(true)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
                  {status === 'draft' ? 'Continue self-appraisal' : 'Open appraisal'}
                </button>
              </div>
            </div>

            <p className="pt-2 text-center text-xs text-gray-400 dark:text-gray-600">
              Performa · Performance Management v3.2 · © Sinergi 2026
            </p>
          </main>
        </div>
      </div>

      <AppraisalDrawer
        open={drawerOpen} onClose={()=>setDrawerOpen(false)}
        kras={kras} setKras={setKras}
        reflection={reflection} setReflection={setReflection}
        status={status}
        onSaveDraft={onSaveDraft} onSubmitFinal={onSubmitFinal} />
      <Toast msg={toast} onClose={()=>setToast(null)} />

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode"  value={t.darkMode}
                     onChange={(v)=>setTweak('darkMode', v)} />
        <TweakSelect label="Brand hue"  value={t.brandHue}
                     options={['indigo','teal','emerald','violet','orange']}
                     onChange={(v)=>setTweak('brandHue', v)} />

        <TweakSection label="Layout" />
        <TweakRadio  label="Density"    value={t.density}
                     options={['compact','regular','roomy']}
                     onChange={(v)=>setTweak('density', v)} />

        <TweakSection label="User role" />
        <TweakRadio  label="Role"       value={t.role}
                     options={['employee','squad_leader']}
                     onChange={(v)=>setTweak('role', v)} />

        <TweakSection label="Appraisal status" />
        <TweakSelect label="Status"     value={t.appraisalState}
                     options={['draft','sl_review','hod_review','hodiv_review','completed']}
                     onChange={(v)=>setTweak('appraisalState', v)} />

        <TweakSection label="Demo actions" />
        <TweakButton label="Open self-appraisal"
                     onClick={()=>setDrawerOpen(true)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
