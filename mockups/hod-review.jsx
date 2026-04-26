// hod-review.jsx — Head of Department (HoD) review page
const { useState, useMemo } = React;

const I = ({ d, className='h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">{d}</svg>
);
const Icon = {
  check:    <I d={<path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>} />,
  checkSm:  <I d={<path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>} className="h-3.5 w-3.5" />,
  chev:     <I d={<path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  chevDn:   <I d={<path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} className="h-3 w-3" />,
  arrowL:   <I d={<path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>} className="h-4 w-4" />,
  send:     <I d={<path d="M4 12 20 4l-3 16-5-7-8-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
  bell:     <I d={<><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  paper:    <I d={<><path d="M5 3h11l3 3v15H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 11h8M8 14h6M8 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  link:     <I d={<><path d="M9 13a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 11a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
  undo:     <I d={<path d="M3 9h13a5 5 0 0 1 0 10H8M3 9l4-4M3 9l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} />,
  team:     <I d={<><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 19c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>} />,
};

const SCORE_SHORT = ['Below','Partial','Meets','Exceeds','Outstanding'];

const EMPLOYEE     = { name:'Aqmal Pratama', initials:'AP', position:'Software Engineer · IC2', squad:'Cart & Checkout', dept:'Engineering' };
const SL           = { name:'Rifky Oktaviano', initials:'RO', role:'Squad Leader' };
const REVIEWER     = { name:'Dewi Anggraeni', initials:'DA', role:'Head of Department', dept:'Engineering' };
const NEXT_REVIEWER = { name:'Bastian Wirajaya', role:'Head of Division' };
const CYCLE        = { name:'Q1 2026 Appraisal', short:'Q1 · 2026' };
const SELF_REFLECTION = 'Strongest cycle so far on platform reliability — checkout latency and OIDC migration both landed near plan. Payment rails slipped due to vendor delay but mitigation is in place.';
const SL_OVERALL   = 'Solid quarter overall. OIDC migration was standout work. Payment rails slip was vendor-driven. Aqmal remains on strong IC3 promotion trajectory.';

const STATUS_FLOW = [
  { key:'draft',        label:'Draft' },
  { key:'sl_review',    label:'SL Review' },
  { key:'hod_review',   label:'HoD Review' },
  { key:'hodiv_review', label:'HoDiv Review' },
  { key:'completed',    label:'Completed' },
];

const INITIAL_KRAS = [
  { id:'k1', title:'Reduce checkout P95 latency',
    desc:'Bring P95 of /checkout below 220ms across our top 3 markets.',
    target:'P95 < 220ms', weight:25,
    self_score:4, self_comment:'Hit 248ms after cart refactor — 20% drop. Awaiting payment-rails work to fully close the gap.',
    evidence:[
      { kind:'url',  name:'Grafana dashboard · checkout P95', date:'Mar 10' },
      { kind:'file', name:'rfc-2026-checkout-rewrite.pdf',    date:'Feb 22' },
    ],
    sl_score:4, sl_comment:"Strong delivery on the core SLO target. The remaining gap is attributable to payment-rails dependency — not within Aqmal's control.",
    hod_score:0, hod_comment:'' },
  { id:'k2', title:'Migrate auth to OIDC provider',
    desc:'Cut over remaining services from legacy session-cookie auth. Coordinate with SecOps on staged rollout.',
    target:'100% service rollout', weight:20,
    self_score:5, self_comment:'10 of 10 services migrated. Zero auth incidents in canary; full rollout completed Mar 4.',
    evidence:[ { kind:'url', name:'Rollout tracker · OIDC', date:'Mar 4' } ],
    sl_score:5, sl_comment:'Flawless execution. Technically complex migration driven end-to-end with zero incidents.',
    hod_score:0, hod_comment:'' },
  { id:'k3', title:'Ship Indonesia payment rails (DANA + GoPay)',
    desc:'GA launch of two e-wallet rails. Vendor contract slipped 3 weeks.',
    target:'GA · DANA + GoPay', weight:20,
    self_score:3, self_comment:'DANA in beta, GoPay UAT pending vendor signoff. Slipped 3 weeks; mitigation plan in place.',
    evidence:[],
    sl_score:3, sl_comment:"Vendor slip was outside Aqmal's control. Parallel UAT strategy was proactive.",
    hod_score:0, hod_comment:'' },
  { id:'k4', title:'Reduce on-call alerts by 30%',
    desc:'Tune noisy SLOs and replace cron-driven alerts with anomaly detection.',
    target:'≥ 30% reduction', weight:15,
    self_score:4, self_comment:'Reached 28% reduction. Two noisy alerts remain; tickets queued for Q2.',
    evidence:[],
    sl_score:4, sl_comment:'98% of target reached. Work-in-progress items have clear Q2 plan.',
    hod_score:0, hod_comment:'' },
  { id:'k5', title:'Mentor 2 junior engineers',
    desc:'Weekly 1:1 cadence + design-review shadowing.',
    target:'2 IC2 promotion-ready', weight:10,
    self_score:4, self_comment:'Both mentees progressing well. Budi submitting promo packet in Q2.',
    evidence:[],
    sl_score:4, sl_comment:'Mentorship cadence consistent. Visible impact on mentee code quality.',
    hod_score:0, hod_comment:'' },
  { id:'k6', title:'Reduce flaky-test rate',
    desc:'Quarantine + author-attribution job. Blocked on CI runner upgrade.',
    target:'Flake rate < 1%', weight:10,
    self_score:2, self_comment:'Reached 2.1% — blocked by CI runner upgrade. Quarantine logic shipped.',
    evidence:[],
    sl_score:2, sl_comment:'Blocked by infra dependency, not performance issue. Quarantine shipped on schedule given constraints.',
    hod_score:0, hod_comment:'' },
];

// ─── Primitives ───────────────────────────────────────────────────────────────
function Avatar({ initials, size='sm', tone='brand' }) {
  const sz = size==='lg'?'h-10 w-10 text-sm':size==='md'?'h-9 w-9 text-xs':'h-8 w-8 text-[11px]';
  const t = { brand:'bg-brand-50 text-brand-600', gray:'bg-gray-100 text-gray-600', violet:'bg-violet-50 text-violet-600' };
  return <div className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sz} ${t[tone]||t.gray}`}>{initials}</div>;
}

function Badge({ tone='gray', children }) {
  const t = { gray:'bg-gray-100 text-gray-700', warning:'bg-warning-50 text-warning-700', brand:'bg-brand-50 text-brand-700', success:'bg-success-50 text-success-700' };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${t[tone]||t.gray}`}>{children}</span>;
}

function ScoreDot({ score }) {
  if (!score) return <span className="text-xs text-gray-400">—</span>;
  const c = score>=5?'text-success-600':score>=4?'text-brand-600':score>=3?'text-warning-600':'text-error-600';
  return <span className={`text-xs font-bold tabular-nums ${c}`}>{score}/5</span>;
}

function ApprovalSteps({ status }) {
  const idx = STATUS_FLOW.findIndex(s=>s.key===status);
  return (
    <ol className="flex items-center gap-2 overflow-x-auto">
      {STATUS_FLOW.map((s,i) => {
        const done=i<idx, cur=i===idx;
        return (
          <li key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${done?'bg-success-50 text-success-700':cur?'bg-brand-50 text-brand-700':'bg-gray-50 text-gray-500'}`}>
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${done?'bg-success-500 text-white':cur?'bg-brand-500 text-white':'bg-gray-300 text-white'}`}>
                {done?Icon.checkSm:i+1}
              </span>
              <span className="text-xs font-semibold">{s.label}</span>
            </div>
            {i<STATUS_FLOW.length-1 && <span className="text-gray-300">{Icon.chev}</span>}
          </li>
        );
      })}
    </ol>
  );
}

function ScorePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={()=>onChange(n)}
          className={`flex flex-col items-center justify-center rounded-xl border py-3 transition-all ${
            value===n?'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20':'border-gray-200 hover:border-gray-300'
          }`}>
          <span className={`text-2xl font-bold ${value===n?'text-brand-600':'text-gray-700'}`}>{n}</span>
          <span className="mt-1 text-[10px] uppercase tracking-wide text-gray-500">{SCORE_SHORT[n-1]}</span>
        </button>
      ))}
    </div>
  );
}

function SelfCard({ kra }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Employee self assessment</p>
        <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-bold text-gray-700">
          {kra.self_score}/5 · {SCORE_SHORT[kra.self_score-1]}
        </span>
      </div>
      {kra.self_comment && <p className="mt-2.5 text-sm leading-relaxed text-gray-700">{kra.self_comment}</p>}
      {kra.evidence?.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {kra.evidence.map((e,i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5">
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded text-xs ${e.kind==='url'?'bg-blue-50 text-blue-500':'bg-brand-50 text-brand-500'}`}>
                {e.kind==='url'?Icon.link:Icon.paper}
              </span>
              <span className="truncate text-xs text-gray-700">{e.name}</span>
              <span className="ml-auto shrink-0 text-[10px] text-gray-400">{e.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PriorCard({ label, initials, score, comment, accentClass='border-violet-200 bg-violet-50/40', textClass='text-violet-600', avatarTone='violet' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border ${accentClass} overflow-hidden`}>
      <button onClick={()=>setOpen(o=>!o)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-2.5">
          <Avatar initials={initials} size="sm" tone={avatarTone} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${textClass}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${score>=4?'bg-success-50 text-success-700':score>=3?'bg-warning-50 text-warning-700':'bg-error-50 text-error-700'}`}>
            {score}/5 · {SCORE_SHORT[score-1]}
          </span>
          <span className={`text-gray-400 transition-transform duration-150 ${open?'rotate-180':''}`}>{Icon.chevDn}</span>
        </div>
      </button>
      {open && comment && (
        <div className="border-t border-gray-200 px-4 py-3">
          <p className="text-sm leading-relaxed text-gray-700">{comment}</p>
        </div>
      )}
    </div>
  );
}

function KRAReview({ kra, onChange }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">KRA · weight {kra.weight}%</p>
      <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-gray-900">{kra.title}</h2>
      <p className="mt-1 text-sm text-gray-500">Target: <span className="font-medium text-gray-700">{kra.target}</span></p>
      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Description</p>
        <p className="mt-1.5 leading-relaxed text-gray-700">{kra.desc}</p>
      </div>
      <div className="mt-5 space-y-3">
        <SelfCard kra={kra} />
        <PriorCard
          label={`SL Review · ${SL.name}`}
          initials={SL.initials}
          score={kra.sl_score}
          comment={kra.sl_comment}
        />
      </div>
      <div className="mt-5 rounded-xl border border-brand-200 bg-brand-50/40 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-600">Your review (HoD)</p>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Reviewer score <span className="text-error-500">*</span>
        </label>
        <ScorePicker value={kra.hod_score} onChange={v=>onChange({hod_score:v})} />
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Comment</label>
          <textarea value={kra.hod_comment} onChange={e=>onChange({hod_comment:e.target.value})} rows={4}
            placeholder="Dept-level perspective, strategic fit, cross-team context, calibration…"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10" />
          <p className="mt-1 text-xs text-gray-400">{kra.hod_comment.length} / 1000</p>
        </div>
      </div>
    </div>
  );
}

function OverallAssessment({ value, onChange }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">Closing assessment</p>
      <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-gray-900">Overall HoD review</h2>
      <p className="mt-1 text-sm text-gray-500">Department-level perspective on Aqmal's Q1 2026 performance.</p>
      <div className="mt-5 space-y-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Employee reflection</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{SELF_REFLECTION}</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Avatar initials={SL.initials} size="sm" tone="violet" />
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">SL overall · {SL.name}</p>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{SL_OVERALL}</p>
        </div>
      </div>
      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Overall HoD comment</label>
        <textarea value={value} onChange={e=>onChange(e.target.value)} rows={8}
          placeholder="Department context, peer calibration, strategic alignment, promotion signal…"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10" />
        <p className="mt-1 text-xs text-gray-400">{value.length} / 2000</p>
      </div>
      <div className="mt-5 rounded-xl border border-warning-200 bg-warning-50 p-3.5">
        <p className="text-sm font-semibold text-warning-800">Ready to approve?</p>
        <p className="mt-0.5 text-sm text-warning-700">
          Once approved, routes to <strong>{NEXT_REVIEWER.name}</strong> ({NEXT_REVIEWER.role}) for final sign-off.
        </p>
      </div>
    </div>
  );
}

function SendBackModal({ open, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-warning-50 text-warning-600">{Icon.undo}</span>
          <div>
            <p className="font-semibold text-gray-900">Send back to SL?</p>
            <p className="text-xs text-gray-500">SL will be notified to revise before re-escalating to HoD.</p>
          </div>
        </div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Reason (required)</label>
        <textarea autoFocus value={reason} onChange={e=>setReason(e.target.value)} rows={4}
          placeholder="Explain what needs to be revised…"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10" />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button onClick={()=>{ if(reason.trim()) onConfirm(reason); }} disabled={!reason.trim()}
            className="rounded-lg bg-warning-600 px-4 py-2 text-sm font-semibold text-white hover:bg-warning-700 disabled:cursor-not-allowed disabled:opacity-50">
            Send back
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, onClose }) {
  React.useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [msg, onClose]);
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
        <span className="text-success-400">{Icon.check}</span>{msg}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [kras, setKras]           = useState(INITIAL_KRAS);
  const [overallComment, setOC]   = useState('');
  const [activeKraId, setActive]  = useState(INITIAL_KRAS[0].id);
  const [showOverall, setOverall] = useState(false);
  const [sendBackOpen, setSBO]    = useState(false);
  const [toast, setToast]         = useState('');
  const [done, setDone]           = useState(false);

  const update = (id, patch) => setKras(prev => prev.map(k => k.id===id ? {...k,...patch} : k));
  const active      = kras.find(k=>k.id===activeKraId);
  const reviewedCnt = kras.filter(k=>k.hod_score>0).length;
  const allReviewed = kras.every(k=>k.hod_score>0);
  const canApprove  = allReviewed && overallComment.trim().length > 0;

  const wSelf = useMemo(() => { const t=kras.reduce((s,k)=>s+k.weight,0); return (kras.reduce((s,k)=>s+(k.self_score*k.weight),0)/t).toFixed(2); }, [kras]);
  const wSL   = useMemo(() => { const t=kras.reduce((s,k)=>s+k.weight,0); return (kras.reduce((s,k)=>s+(k.sl_score*k.weight),0)/t).toFixed(2); }, [kras]);
  const wHoD  = useMemo(() => {
    const scored=kras.filter(k=>k.hod_score>0);
    if (!scored.length) return null;
    const t=scored.reduce((s,k)=>s+k.weight,0);
    return (scored.reduce((s,k)=>s+(k.hod_score*k.weight),0)/t).toFixed(2);
  }, [kras]);

  const onPrev = () => {
    if (showOverall) { setOverall(false); setActive(kras[kras.length-1].id); return; }
    const i=kras.findIndex(k=>k.id===activeKraId); if (i>0) setActive(kras[i-1].id);
  };
  const onNext = () => {
    if (showOverall) return;
    const i=kras.findIndex(k=>k.id===activeKraId);
    if (i<kras.length-1) setActive(kras[i+1].id); else setOverall(true);
  };

  if (done) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md rounded-2xl border border-success-200 bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-success-50 text-success-600">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none"><path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Approved!</h1>
        <p className="mt-2 text-sm text-gray-500">Forwarded to <strong>{NEXT_REVIEWER.name}</strong> for HoDiv final sign-off.</p>
        <a href="KPI Dashboard.html" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">Back to dashboard</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-5 py-6 lg:flex">
          <a href="KPI Dashboard.html" className="flex items-center gap-2.5 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M5 17l4-9 3 6 3-4 4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-gray-800">Performa</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Reviewer Console</p>
            </div>
          </a>
          <p className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">Reviews</p>
          <nav className="mt-2 flex flex-col gap-1">
            <a href="HoD Review.html" className="flex items-center gap-3 rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-700">
              <span className="text-brand-500">{Icon.team}</span>
              <span className="flex-1">Pending Reviews</span>
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">3</span>
            </a>
            <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <span className="text-gray-400">{Icon.paper}</span>
              <span className="flex-1 text-left">Completed Reviews</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">28</span>
            </button>
          </nav>
          <a href="KPI Dashboard.html" className="mt-auto block rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-white p-4 hover:border-brand-300">
            <p className="text-xs font-semibold text-gray-800">My Appraisal</p>
            <p className="mt-1 text-[11px] leading-snug text-gray-500">View your own Q1 2026 self-appraisal.</p>
          </a>
        </aside>

        <main className="min-w-0 flex-1 bg-gray-50/60">
          <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur">
            <div className="flex h-16 items-center gap-4 px-6">
              <a href="KPI Dashboard.html" className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50">
                {Icon.arrowL}<span>Dashboard</span>
              </a>
              <nav className="hidden items-center gap-1.5 text-xs text-gray-500 md:flex">
                <span>Reviews</span><span>{Icon.chev}</span>
                <span className="font-semibold text-gray-800">Aqmal Pratama — Q1 2026</span>
                <span>{Icon.chev}</span><span>HoD Review</span>
              </nav>
              <div className="ml-auto flex items-center gap-2">
                <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                  {Icon.bell}
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error-500 ring-2 ring-white" />
                </button>
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-2 py-1.5">
                  <Avatar initials={REVIEWER.initials} size="md" />
                  <div className="hidden pr-2 text-left lg:block">
                    <p className="text-sm font-semibold text-gray-800">{REVIEWER.name}</p>
                    <p className="text-[11px] text-gray-500">{REVIEWER.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="px-6 py-6 lg:px-8">
            {/* Hero */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar initials={EMPLOYEE.initials} size="lg" tone="gray" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">HoD Review · {CYCLE.short}</p>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">{EMPLOYEE.name}</h1>
                    <p className="mt-0.5 text-sm text-gray-500">{EMPLOYEE.position} · {EMPLOYEE.dept}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="warning">Pending HoD Review</Badge>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs flex items-center gap-2">
                    <span className="text-gray-500">Self: <span className="font-semibold text-gray-800">{wSelf}</span></span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">SL: <span className="font-semibold text-violet-600">{wSL}</span></span>
                    {wHoD && <><span className="text-gray-300">|</span><span className="text-gray-500">HoD: <span className="font-semibold text-brand-600">{wHoD}</span></span></>}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-x-6">
                <div className="min-w-[16rem] flex-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Review progress</span>
                    <span className="font-semibold tabular-nums text-gray-700">{reviewedCnt}/{kras.length} KRAs reviewed</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full bg-brand-500 transition-all" style={{width:`${Math.round(reviewedCnt/kras.length*100)}%`}} />
                  </div>
                </div>
              </div>
              <div className="mt-5 border-t border-gray-100 pt-4">
                <ApprovalSteps status="hod_review" />
              </div>
            </section>

            {/* Two-column */}
            <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <aside className="lg:col-span-4 xl:col-span-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                  <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    KRA list · {reviewedCnt}/{kras.length} reviewed
                  </p>
                  {kras.map(k => {
                    const isAct = !showOverall && k.id===activeKraId;
                    return (
                      <button key={k.id} onClick={()=>{setActive(k.id);setOverall(false);}}
                        className={`mb-1.5 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${isAct?'bg-brand-50/60 ring-1 ring-brand-500/30':'hover:bg-gray-50'}`}>
                        <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${k.hod_score>0?'bg-success-500 text-white':'border-2 border-dashed border-gray-300 text-gray-400'}`}>
                          {k.hod_score>0?Icon.checkSm:''}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-semibold ${isAct?'text-gray-900':'text-gray-700'}`}>{k.title}</p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-gray-500">
                            <span>W {k.weight}%</span>
                            <span className="text-gray-300">·</span>
                            <span>Self <ScoreDot score={k.self_score}/></span>
                            <span className="text-gray-300">·</span>
                            <span>SL <ScoreDot score={k.sl_score}/></span>
                            <span className="text-gray-300">·</span>
                            <span>HoD <ScoreDot score={k.hod_score}/></span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  <button onClick={()=>setOverall(true)}
                    className={`mt-2 flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${showOverall?'bg-brand-50/60 ring-1 ring-brand-500/30':'hover:bg-gray-50'}`}>
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${overallComment.trim()?'bg-success-500 text-white':'border-2 border-dashed border-gray-300 text-gray-400'}`}>
                      {overallComment.trim()?Icon.checkSm:''}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-700">Overall Assessment</p>
                      <p className="mt-0.5 text-[11px] text-gray-500">HoD comment + approve</p>
                    </div>
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Approval checklist</p>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    {[[allReviewed,'All KRAs scored'],[overallComment.trim().length>0,'Overall comment written']].map(([ok,label],i)=>(
                      <li key={i} className="flex items-center gap-2">
                        <span className={`grid h-4 w-4 place-items-center rounded-full ${ok?'bg-success-500 text-white':'border border-gray-300'}`}>{ok?Icon.checkSm:''}</span>
                        <span className={ok?'text-gray-700':'text-gray-500'}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              <div className="lg:col-span-8 xl:col-span-9">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
                  {!showOverall && active && <KRAReview kra={active} onChange={p=>update(active.id,p)} />}
                  {showOverall && <OverallAssessment value={overallComment} onChange={setOC} />}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-2">
                      <button onClick={onPrev} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        {Icon.arrowL}<span>Previous</span>
                      </button>
                      {!showOverall && (
                        <button onClick={onNext} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                          <span>Next</span>{Icon.chev}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>setToast('Draft saved')} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Save draft
                      </button>
                      <button onClick={()=>setSBO(true)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-warning-300 bg-warning-50 px-4 text-xs font-semibold text-warning-700 hover:bg-warning-100">
                        {Icon.undo}<span>Send back</span>
                      </button>
                      <button onClick={()=>{ if(canApprove) setDone(true); else setToast('Score all KRAs and add overall comment first'); }}
                        className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold text-white ${canApprove?'bg-brand-500 hover:bg-brand-600':'cursor-not-allowed bg-gray-300'}`}>
                        {Icon.send}<span>Approve → HoDiv</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <SendBackModal open={sendBackOpen} onConfirm={()=>{setSBO(false);setToast(`Sent back to ${SL.name} (SL)`);}} onCancel={()=>setSBO(false)} />
      <Toast msg={toast} onClose={()=>setToast('')} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
