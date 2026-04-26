// self-appraisal.jsx — Standalone full-page Self Appraisal form
const { useState, useEffect, useRef, useMemo } = React;

// ─── Icons ──────────────────────────────────────────────────────────────────
const I = ({ d, className='h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">{d}</svg>
);
const Icon = {
  dash:    <I d={<rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>} />,
  doc:     <I d={<><path d="M6 3h9l4 4v14H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />,
  paper:   <I d={<><path d="M5 3h11l3 3v15H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 11h8M8 14h6M8 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  team:    <I d={<><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  clock:   <I d={<><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8v4l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  feedback:<I d={<path d="M4 5h16v10H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  cog:     <I d={<><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.2-1.3L14 3h-4l-.4 2.4a7 7 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.2 1.3L10 21h4l.4-2.4a7 7 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></>} />,
  bell:    <I d={<><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  search:  <I d={<><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  check:   <I d={<path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>} />,
  x:       <I d={<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>} />,
  send:    <I d={<path d="M4 12 20 4l-3 16-5-7-8-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  link:    <I d={<><path d="M9 13a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 11a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  upload:  <I d={<><path d="M12 4v12m0-12-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 16v4h14v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>} />,
  trash:   <I d={<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  chev:    <I d={<path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  chevDown:<I d={<path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  arrowL:  <I d={<path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
};

// ─── Mock data ──────────────────────────────────────────────────────────────
const USER = {
  name:'Aqmal Pratama', initials:'AP',
  position:'Software Engineer', squad:'Cart & Checkout',
  squadLeader:    { name:'Rifky Oktaviano',  initials:'RO' },
  headOfDept:     { name:'Dewi Anggraeni',   initials:'DA' },
  headOfDivision: { name:'Bastian Wirajaya', initials:'BW' },
};

const CYCLE = {
  name:'Q1 2026 Appraisal', short:'Q1 · 2026',
  start:'Jan 1, 2026', end:'Mar 31, 2026',
  template:'Engineering · Software Engineer · v3',
};

const STATUS_FLOW = [
  { key:'draft',        label:'Draft',         actor:'You' },
  { key:'sl_review',    label:'SL Review',     actor:USER.squadLeader.name },
  { key:'hod_review',   label:'HoD Review',    actor:USER.headOfDept.name },
  { key:'hodiv_review', label:'HoDiv Review',  actor:USER.headOfDivision.name },
  { key:'completed',    label:'Completed',     actor:'HR' },
];

const INITIAL_KRAS = [
  { id:'k1', title:'Reduce checkout P95 latency',
    description:'Bring P95 of /checkout below 220ms across our top 3 markets. Own the cart-service refactor and SLO tuning.',
    target:'P95 < 220ms', weight:25,
    self_score:4, self_comment:'Hit 248ms after cart refactor — 20% drop. Awaiting payment-rails work to fully close the gap.',
    evidence:[
      { kind:'url',  name:'Grafana dashboard · checkout P95', url:'https://grafana.internal/d/checkout-p95', date:'Mar 10' },
      { kind:'file', name:'rfc-2026-checkout-rewrite.pdf', size:'412 KB', date:'Feb 22' },
    ]},
  { id:'k2', title:'Migrate auth to OIDC provider',
    description:'Cut over remaining services from legacy session-cookie auth. Coordinate with SecOps on staged rollout.',
    target:'100% service rollout', weight:20,
    self_score:5, self_comment:'10 of 10 services migrated. Zero auth incidents in canary; full rollout completed Mar 4.',
    evidence:[ { kind:'url',  name:'Rollout tracker · OIDC', url:'https://confluence.internal/oidc', date:'Mar 4' } ]},
  { id:'k3', title:'Ship Indonesia payment rails (DANA + GoPay)',
    description:'GA launch of two e-wallet rails. Vendor contract slipped 3 weeks; mitigation via parallel UAT.',
    target:'GA · DANA + GoPay', weight:20,
    self_score:3, self_comment:'DANA in beta, GoPay UAT pending vendor signoff. Slipped 3 weeks; mitigation plan in place.',
    evidence:[]},
  { id:'k4', title:'Reduce on-call alerts by 30%',
    description:'Tune noisy SLOs and replace cron-driven alerts with anomaly detection on the order pipeline.',
    target:'≥ 30% reduction', weight:15,
    self_score:4, self_comment:'Reached 28% reduction. Two noisy alerts remain; tickets queued for Q2.',
    evidence:[]},
  { id:'k5', title:'Mentor 2 junior engineers',
    description:'Weekly 1:1 cadence + design-review shadowing. One mentee submitting promo packet this cycle.',
    target:'2 IC2 promotion-ready', weight:10,
    self_score:0, self_comment:'',
    evidence:[]},
  { id:'k6', title:'Reduce flaky-test rate',
    description:'Quarantine + author-attribution job. Blocked on CI runner upgrade scheduled for May.',
    target:'Flake rate < 1%', weight:10,
    self_score:0, self_comment:'',
    evidence:[]},
];

// ─── Primitives ─────────────────────────────────────────────────────────────
function Avatar({ initials, size='sm' }) {
  const sz = size === 'lg' ? 'h-10 w-10 text-sm' : size === 'md' ? 'h-9 w-9 text-xs' : 'h-8 w-8 text-[11px]';
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300 ${sz}`}>
      {initials}
    </div>
  );
}

function Badge({ tone='gray', children }) {
  const tones = {
    gray:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    brand:   'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

const STATUS_TONE = { draft:'gray', sl_review:'warning', hod_review:'warning', hodiv_review:'warning', completed:'success' };
function StatusBadge({ status }) {
  const item = STATUS_FLOW.find(s => s.key === status) || STATUS_FLOW[0];
  return <Badge tone={STATUS_TONE[status]}>{item.label}</Badge>;
}

// ─── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ active='self_appraisal' }) {
  const items = [
    { id:'dashboard',      label:'Dashboard',       icon: Icon.dash,     href:'KPI Dashboard.html' },
    { id:'my_appraisal',   label:'My Appraisals',   icon: Icon.doc,      href:'KPI Dashboard.html', badge:'Q1' },
    { id:'self_appraisal', label:'Self Appraisal',  icon: Icon.paper },
    { id:'cycles',         label:'Cycles',          icon: Icon.clock },
    { id:'feedback',       label:'Feedback',        icon: Icon.feedback },
  ];
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
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Performance · v3.2</p>
        </div>
      </a>

      <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">Menu</p>
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
              <span className={isActive ? 'text-brand-500 dark:text-brand-300' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'}>{it.icon}</span>
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

      <div className="mt-auto rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-white p-4 dark:border-gray-800 dark:from-brand-500/10 dark:to-transparent">
        <p className="text-xs font-semibold text-gray-800 dark:text-white/90">{CYCLE.name}</p>
        <p className="mt-1 text-[11px] leading-snug text-gray-500 dark:text-gray-400">Cycle ends {CYCLE.end}</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white dark:bg-gray-900">
          <div className="h-full bg-brand-500" style={{ width:'82%' }} />
        </div>
      </div>
    </aside>
  );
}

// ─── Approval steps ─────────────────────────────────────────────────────────
function ApprovalSteps({ status }) {
  const idx = STATUS_FLOW.findIndex(s => s.key === status);
  return (
    <ol className="flex items-center gap-2 overflow-x-auto">
      {STATUS_FLOW.map((s, i) => {
        const done = i < idx;
        const cur  = i === idx;
        return (
          <li key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${
              done ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
                : cur ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                : 'bg-gray-50 text-gray-500 dark:bg-white/[0.03] dark:text-gray-400'
            }`}>
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${
                done ? 'bg-success-500 text-white' : cur ? 'bg-brand-500 text-white' : 'bg-gray-300 text-white dark:bg-gray-700'
              }`}>{done ? Icon.check : i+1}</span>
              <span className="text-xs font-semibold">{s.label}</span>
            </div>
            {i < STATUS_FLOW.length - 1 && <span className="text-gray-300 dark:text-gray-700">{Icon.chev}</span>}
          </li>
        );
      })}
    </ol>
  );
}

// ─── Evidence adder ─────────────────────────────────────────────────────────
function EvidenceAdder({ onAdd }) {
  const [mode, setMode] = useState(null);
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
      if (f.size > 5 * 1024 * 1024) { alert(`${f.name} is over 5 MB.`); return; }
      onAdd({ kind:'file', name: f.name, size: `${(f.size/1024).toFixed(0)} KB`, mime: f.type, date:'today' });
    });
    reset();
  };

  if (mode === 'url') return (
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
          className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">Add link</button>
      </div>
    </div>
  );

  if (mode === 'file') return (
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
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors ${
          drag
            ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10'
            : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50/30 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500/40'
        }`}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">{Icon.upload}</span>
        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{drag ? 'Drop to upload' : 'Drop file here, or click to browse'}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">PDF, DOC, XLS, PNG · max 5 MB</p>
        <input ref={fileRef} type="file" multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.md,.txt"
          onChange={(e)=>onFiles(e.target.files)}
          className="hidden" />
      </div>
    </div>
  );

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

// ─── KRA / Reflection forms ─────────────────────────────────────────────────
function KRAForm({ k, disabled, onChange }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">KRA · weight {k.weight}%</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{k.title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Target: <span className="font-medium text-gray-700 dark:text-gray-300">{k.target}</span></p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description (from template)</p>
        <p className="mt-1.5 leading-relaxed">{k.description}</p>
      </div>

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

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Self comment</label>
        <textarea
          value={k.self_comment} onChange={(e)=>onChange({ self_comment: e.target.value })}
          disabled={disabled}
          rows={5}
          placeholder="What did you deliver against this KRA? Numbers, links, lessons learned…"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
        <p className="mt-1 text-xs text-gray-400">{k.self_comment.length} / 1000</p>
      </div>

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
                e.kind === 'url' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300'
                                 : 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300'
              }`}>{e.kind === 'url' ? Icon.link : Icon.paper}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">{e.name}</p>
                <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                  {e.kind === 'url' ? <>URL{e.url ? ` · ${e.url}` : ''} · added {e.date}</>
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

function ReflectionForm({ value, disabled, onChange }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">Closing narrative</p>
      <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Employee reflection</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Step back from the KRAs — overall, how did this cycle go for you?</p>

      <textarea
        value={value} onChange={(e)=>onChange(e.target.value)}
        disabled={disabled}
        rows={14}
        placeholder="Highlights, challenges, growth areas, what you'd do differently next cycle…"
        className="mt-5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
      <p className="mt-1 text-xs text-gray-400">{value.length} / 4000</p>

      <div className="mt-5 rounded-xl border border-warning-200 bg-warning-50 p-3.5 text-sm dark:border-warning-800/50 dark:bg-warning-500/10">
        <p className="font-semibold text-warning-800 dark:text-warning-300">Before you submit</p>
        <p className="mt-0.5 text-warning-700 dark:text-warning-400">
          Once submitted final, this appraisal routes to {USER.squadLeader.name} (SL) → {USER.headOfDept.name} (HoD) → {USER.headOfDivision.name} (HoDiv).
          You won't be able to edit after submission.
        </p>
      </div>
    </div>
  );
}

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [msg, onClose]);
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-gray-900">
        <span className="text-success-400 dark:text-success-600">{Icon.check}</span>{msg}
      </div>
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
function App() {
  const [kras, setKras] = useState(INITIAL_KRAS);
  const [reflection, setReflection] = useState('Strongest cycle so far on platform reliability — checkout latency and OIDC migration both landed near plan. Payment rails slipped due to vendor delay.');
  const [status, setStatus] = useState('draft');
  const [activeKraId, setActiveKraId] = useState(kras[0].id);
  const [showReflection, setShowReflection] = useState(false);
  const [toast, setToast] = useState('');

  const updateKra = (id, patch) => setKras(prev => prev.map(k => k.id === id ? { ...k, ...patch } : k));
  const active = kras.find(k => k.id === activeKraId);
  const totalWeight = kras.reduce((a,k)=>a+k.weight, 0);
  const filledKras = kras.filter(k => k.self_score > 0);
  const allScored = kras.every(k => k.self_score > 0);
  const reflectionFilled = reflection.trim().length > 0;
  const completion = useMemo(
    () => Math.round(((filledKras.length + (reflectionFilled ? 1 : 0)) / (kras.length + 1)) * 100),
    [filledKras.length, reflectionFilled, kras.length]
  );
  const submitDisabled = !(allScored && reflectionFilled) || status !== 'draft';
  const disabled = status !== 'draft';

  const onPrev = () => {
    if (showReflection) { setShowReflection(false); setActiveKraId(kras[kras.length - 1].id); return; }
    const i = kras.findIndex(k => k.id === activeKraId);
    if (i > 0) setActiveKraId(kras[i-1].id);
  };
  const onNext = () => {
    if (showReflection) return;
    const i = kras.findIndex(k => k.id === activeKraId);
    if (i < kras.length - 1) setActiveKraId(kras[i+1].id);
    else setShowReflection(true);
  };

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar active="self_appraisal" />

        <main className="flex-1 min-w-0 bg-gray-50/60 dark:bg-gray-950/60">
          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
            <div className="flex h-16 items-center gap-4 px-6">
              <a href="KPI Dashboard.html" className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
                {Icon.arrowL}<span>Dashboard</span>
              </a>
              <nav className="hidden items-center gap-1.5 text-xs text-gray-500 md:flex dark:text-gray-400">
                <span>My Appraisals</span>
                <span>{Icon.chev}</span>
                <span className="font-semibold text-gray-800 dark:text-white">{CYCLE.name}</span>
                <span>{Icon.chev}</span>
                <span>Self Appraisal</span>
              </nav>
              <div className="ml-auto flex items-center gap-2">
                <Avatar initials={USER.initials} size="md" />
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{USER.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{USER.position} · {USER.squad}</p>
                </div>
                <span className="hidden text-gray-400 lg:block">{Icon.chevDown}</span>
              </div>
            </div>
          </header>

          <div className="px-6 py-6 lg:px-8">
            {/* Hero */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.02]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">Self appraisal · {CYCLE.short}</p>
                  <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{CYCLE.name}</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Template: {CYCLE.template} · KRA weight total {totalWeight}% · cycle window {CYCLE.start} – {CYCLE.end}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={status} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Last saved <span className="font-medium text-gray-700 dark:text-gray-300">2 min ago</span></span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="min-w-[16rem] flex-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                    <span>Completion</span>
                    <span className="font-semibold tabular-nums text-gray-700 dark:text-gray-300">{filledKras.length}/{kras.length} KRAs · reflection {reflectionFilled ? '✓' : '—'} · {completion}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.05]">
                    <div className="h-full bg-brand-500 transition-all" style={{ width: `${completion}%` }} />
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
                  <p className="text-gray-500 dark:text-gray-400">Reviewers chain</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Avatar initials={USER.squadLeader.initials} />
                    <span className="text-gray-400">→</span>
                    <Avatar initials={USER.headOfDept.initials} />
                    <span className="text-gray-400">→</span>
                    <Avatar initials={USER.headOfDivision.initials} />
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
                <ApprovalSteps status={status} />
              </div>
            </section>

            {/* 2-column form */}
            <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* KRA list */}
              <aside className="lg:col-span-4 xl:col-span-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-white/[0.02]">
                  <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    KRA list · {filledKras.length}/{kras.length} scored
                  </p>
                  {kras.map(k => {
                    const filled = k.self_score > 0;
                    const isActive = !showReflection && k.id === activeKraId;
                    return (
                      <button key={k.id} onClick={() => { setActiveKraId(k.id); setShowReflection(false); }}
                        className={`mb-1.5 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          isActive
                            ? 'bg-brand-50/60 ring-1 ring-brand-500/30 dark:bg-brand-500/10 dark:ring-brand-500/40'
                            : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                        }`}>
                        <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                          filled ? 'bg-success-500 text-white' : 'border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-700'
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
                        ? 'bg-brand-50/60 ring-1 ring-brand-500/30 dark:bg-brand-500/10 dark:ring-brand-500/40'
                        : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                    }`}>
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                      reflectionFilled ? 'bg-success-500 text-white' : 'border-2 border-dashed border-gray-300 text-gray-400 dark:border-gray-700'
                    }`}>{reflectionFilled ? Icon.check : ''}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-700 dark:text-gray-300">Employee reflection</p>
                      <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">Closing narrative</p>
                    </div>
                  </button>
                </div>

                {/* Submit checklist */}
                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.02]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Submit checklist</p>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    <li className="flex items-center gap-2">
                      <span className={`grid h-4 w-4 place-items-center rounded-full ${allScored ? 'bg-success-500 text-white' : 'border border-gray-300 text-gray-300 dark:border-gray-700'}`}>{allScored ? Icon.check : ''}</span>
                      <span className={allScored ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}>All KRAs scored</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`grid h-4 w-4 place-items-center rounded-full ${reflectionFilled ? 'bg-success-500 text-white' : 'border border-gray-300 text-gray-300 dark:border-gray-700'}`}>{reflectionFilled ? Icon.check : ''}</span>
                      <span className={reflectionFilled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}>Reflection written</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`grid h-4 w-4 place-items-center rounded-full ${totalWeight === 100 ? 'bg-success-500 text-white' : 'border border-gray-300 text-gray-300 dark:border-gray-700'}`}>{totalWeight === 100 ? Icon.check : ''}</span>
                      <span className="text-gray-500 dark:text-gray-400">Weight totals 100% (template)</span>
                    </li>
                  </ul>
                </div>
              </aside>

              {/* Form pane */}
              <div className="lg:col-span-8 xl:col-span-9">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.02] lg:p-8">
                  {!showReflection && active && (
                    <KRAForm k={active} disabled={disabled} onChange={(p)=>updateKra(active.id, p)} />
                  )}
                  {showReflection && (
                    <ReflectionForm value={reflection} disabled={disabled} onChange={setReflection} />
                  )}

                  {/* Pager + actions */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <button onClick={onPrev}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">
                        {Icon.arrowL}<span>Previous</span>
                      </button>
                      {!showReflection && (
                        <button onClick={onNext}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">
                          <span>Next</span>{Icon.chev}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>setToast('Draft saved')} disabled={disabled}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">
                        Save draft
                      </button>
                      <button onClick={()=>{ setStatus('sl_review'); setToast(`Submitted to ${USER.squadLeader.name}`); }} disabled={submitDisabled}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-xs font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
                        {Icon.send}<span>Submit final</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Toast msg={toast} onClose={()=>setToast('')} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
