// hodiv-review.jsx — Head of Division (HoDiv) final sign-off page
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
  star:     <I d={<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>} />,
};

const SCORE_SHORT = ['Below','Partial','Meets','Exceeds','Outstanding'];

const EMPLOYEE     = { name:'Aqmal Pratama', initials:'AP', position:'Software Engineer · IC2', squad:'Cart & Checkout', dept:'Engineering' };
const SL           = { name:'Rifky Oktaviano', initials:'RO', role:'Squad Leader' };
const HOD          = { name:'Dewi Anggraeni', initials:'DA', role:'Head of Department', dept:'Engineering' };
const REVIEWER     = { name:'Bastian Wirajaya', initials:'BW', role:'Head of Division', div:'Technology' };
const CYCLE        = { name:'Q1 2026 Appraisal', short:'Q1 · 2026' };

const SELF_REFLECTION = 'Strongest cycle so far on platform reliability — checkout latency and OIDC migration both landed near plan. Payment rails slipped due to vendor delay but mitigation is in place.';
const SL_OVERALL   = 'Solid quarter overall. OIDC migration was standout work. Payment rails slip was vendor-driven. Aqmal remains on strong IC3 promotion trajectory.';
const HOD_OVERALL  = 'Aqmal delivered the critical infrastructure milestones this quarter. The OIDC migration and latency improvements are strategic wins for the Engineering org. Recommend strong rating — consistent IC3 candidate.';

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
    hod_score:4, hod_comment:'Consistent with dept-level engineering standards. The latency reduction impacts top-line conversion — strategically important.',
    hodiv_score:0, hodiv_comment:'' },
  { id:'k2', title:'Migrate auth to OIDC provider',
    desc:'Cut over remaining services from legacy session-cookie auth. Coordinate with SecOps on staged rollout.',
    target:'100% service rollout', weight:20,
    self_score:5, self_comment:'10 of 10 services migrated. Zero auth incidents in canary; full rollout completed Mar 4.',
    evidence:[ { kind:'url', name:'Rollout tracker · OIDC', date:'Mar 4' } ],
    sl_score:5, sl_comment:'Flawless execution. Technically complex migration driven end-to-end with zero incidents.',
    hod_score:5, hod_comment:'Exemplary cross-team execution. SecOps commended the coordination. Sets new bar for compliance-driven migrations.',
    hodiv_score:0, hodiv_comment:'' },
  { id:'k3', title:'Ship Indonesia payment rails (DANA + GoPay)',
    desc:'GA launch of two e-wallet rails. Vendor contract slipped 3 weeks.',
    target:'GA · DANA + GoPay', weight:20,
    self_score:3, self_comment:'DANA in beta, GoPay UAT pending vendor signoff. Slipped 3 weeks; mitigation plan in place.',
    evidence:[],
    sl_score:3, sl_comment:"Vendor slip was outside Aqmal's control. Parallel UAT strategy was proactive.",
    hod_score:3, hod_comment:'Market-critical delivery slipped but risk was surfaced early. Division leadership was kept informed. Mitigation posture appropriate.',
    hodiv_score:0, hodiv_comment:'' },
  { id:'k4', title:'Reduce on-call alerts by 30%',
    desc:'Tune noisy SLOs and replace cron-driven alerts with anomaly detection.',
    target:'≥ 30% reduction', weight:15,
    self_score:4, self_comment:'Reached 28% reduction. Two noisy alerts remain; tickets queued for Q2.',
    evidence:[],
    sl_score:4, sl_comment:'98% of target reached. Work-in-progress items have clear Q2 plan.',
    hod_score:4, hod_comment:'Meaningful operational improvement. Fewer false pages improves team sustainability — valued at division level.',
    hodiv_score:0, hodiv_comment:'' },
  { id:'k5', title:'Mentor 2 junior engineers',
    desc:'Weekly 1:1 cadence + design-review shadowing.',
    target:'2 IC2 promotion-ready', weight:10,
    self_score:4, self_comment:'Both mentees progressing well. Budi submitting promo packet in Q2.',
    evidence:[],
    sl_score:4, sl_comment:'Mentorship cadence consistent. Visible impact on mentee code quality.',
    hod_score:4, hod_comment:'Leadership signal is strong here. Developing the next layer of ICs is exactly what the division needs.',
    hodiv_score:0, hodiv_comment:'' },
  { id:'k6', title:'Reduce flaky-test rate',
    desc:'Quarantine + author-attribution job. Blocked on CI runner upgrade.',
    target:'Flake rate < 1%', weight:10,
    self_score:2, self_comment:'Reached 2.1% — blocked by CI runner upgrade. Quarantine logic shipped.',
    evidence:[],
    sl_score:2, sl_comment:'Blocked by infra dependency, not performance issue. Quarantine shipped on schedule given constraints.',
    hod_score:2, hod_comment:'Infrastructure dependency was a known blocker. The shipped quarantine tooling is still a net positive for the org.',
    hodiv_score:0, hodiv_comment:'' },
];

// ─── Primitives ───────────────────────────────────────────────────────────────
function Avatar({ initials, size='sm', tone='brand' }) {
  const sz = size==='lg'?'h-10 w-10 text-sm':size==='md'?'h-9 w-9 text-xs':'h-8 w-8 text-[11px]';
  const t = { brand:'bg-brand-50 text-brand-600', gray:'bg-gray-100 text-gray-600', violet:'bg-violet-50 text-violet-600', teal:'bg-teal-50 text-teal-600' };
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
        <PriorCard
          label={`HoD Review · ${HOD.name}`}
          initials={HOD.initials}
          score={kra.hod_score}
          comment={kra.hod_comment}
          accentClass="border-teal-200 bg-teal-50/40"
          textClass="text-teal-700"
          avatarTone="teal"
        />
      </div>
      <div className="mt-5 rounded-xl border border-brand-200 bg-brand-50/40 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-600">Your review (HoDiv)</p>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Reviewer score <span className="text-error-500">*</span>
        </label>
        <ScorePicker value={kra.hodiv_score} onChange={v=>onChange({hodiv_score:v})} />
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Comment</label>
          <textarea value={kra.hodiv_comment} onChange={e=>onChange({hodiv_comment:e.target.value})} rows={4}
            placeholder="Division-level perspective, strategic importance, cross-dept calibration…"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10" />
          <p className="mt-1 text-xs text-gray-400">{kra.hodiv_comment.length} / 1000</p>
        </div>
      </div>
    </div>
  );
}

function OverallAssessment({ overallComment, onChange, finalScore, onFinalScore }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">Closing assessment</p>
      <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-gray-900">Overall HoDiv review</h2>
      <p className="mt-1 text-sm text-gray-500">Division-level final sign-off and calibrated rating for {EMPLOYEE.name}.</p>
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
        <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Avatar initials={HOD.initials} size="sm" tone="teal" />
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">HoD overall · {HOD.name}</p>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{HOD_OVERALL}</p>
        </div>
      </div>
      <div className="mt-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Calibrated final rating <span className="text-error-500">*</span>
        </label>
        <p className="mb-3 text-xs text-gray-500">This score is released to the employee after the cycle closes. It reflects the division's calibrated view.</p>
        <ScorePicker value={finalScore} onChange={onFinalScore} />
      </div>
      <div className="mt-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Overall HoDiv comment <span className="text-error-500">*</span></label>
        <textarea value={overallComment} onChange={e=>onChange(e.target.value)} rows={8}
          placeholder="Division context, talent calibration, strategic alignment, promotion signal, development areas…"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-relaxed text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10" />
        <p className="mt-1 text-xs text-gray-400">{overallComment.length} / 2000</p>
      </div>
      <div className="mt-5 rounded-xl border border-success-200 bg-success-50 p-3.5">
        <p className="text-sm font-semibold text-success-800">This is the final sign-off.</p>
        <p className="mt-0.5 text-sm text-success-700">
          Completing the appraisal marks the cycle as <strong>Completed</strong>. The calibrated rating will be visible to {EMPLOYEE.name} once the cycle closes.
        </p>
      </div>
    </div>
  );
}

function SendBackModal({ open, target, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-warning-50 text-warning-600">{Icon.undo}</span>
          <div>
            <p className="font-semibold text-gray-900">Send back to {target}?</p>
            <p className="text-xs text-gray-500">{target} will be notified to revise before re-escalating.</p>
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
  const [finalScore, setFinalScore] = useState(0);
  const [activeKraId, setActive]  = useState(INITIAL_KRAS[0].id);
  const [showOverall, setOverall] = useState(false);
  const [sendBackOpen, setSBO]    = useState(false);
  const [sendBackTarget, setSBT]  = useState('HoD');
  const [toast, setToast]         = useState('');
  const [done, setDone]           = useState(false);

  const update = (id, patch) => setKras(prev => prev.map(k => k.id===id ? {...k,...patch} : k));
  const active      = kras.find(k=>k.id===activeKraId);
  const reviewedCnt = kras.filter(k=>k.hodiv_score>0).length;
  const allReviewed = kras.every(k=>k.hodiv_score>0);
  const canApprove  = allReviewed && finalScore > 0 && overallComment.trim().length > 0;

  const wSelf = useMemo(() => { const t=kras.reduce((s,k)=>s+k.weight,0); return (kras.reduce((s,k)=>s+(k.self_score*k.weight),0)/t).toFixed(2); }, [kras]);
  const wSL   = useMemo(() => { const t=kras.reduce((s,k)=>s+k.weight,0); return (kras.reduce((s,k)=>s+(k.sl_score*k.weight),0)/t).toFixed(2); }, [kras]);
  const wHoD  = useMemo(() => { const t=kras.reduce((s,k)=>s+k.weight,0); return (kras.reduce((s,k)=>s+(k.hod_score*k.weight),0)/t).toFixed(2); }, [kras]);
  const wHoDiv = useMemo(() => {
    const scored=kras.filter(k=>k.hodiv_score>0);
    if (!scored.length) return null;
    const t=scored.reduce((s,k)=>s+k.weight,0);
    return (scored.reduce((s,k)=>s+(k.hodiv_score*k.weight),0)/t).toFixed(2);
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
        <h1 className="font-display text-2xl font-bold text-gray-900">Appraisal Completed!</h1>
        <p className="mt-2 text-sm text-gray-500">Calibrated final rating: <strong className="text-gray-900">{finalScore}/5 · {SCORE_SHORT[finalScore-1]}</strong></p>
        <p className="mt-1.5 text-sm text-gray-500">{EMPLOYEE.name}'s {CYCLE.name} is now closed.</p>
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
            <a href="HoDiv Review.html" className="flex items-center gap-3 rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-700">
              <span className="text-brand-500">{Icon.team}</span>
              <span className="flex-1">HoDiv Reviews</span>
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">1</span>
            </a>
          </nav>
          <div className="mt-auto space-y-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Reviewer</p>
              <div className="mt-2 flex items-center gap-2">
                <Avatar initials={REVIEWER.initials} size="sm" tone="brand" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{REVIEWER.name}</p>
                  <p className="text-[11px] text-gray-500">{REVIEWER.role} · {REVIEWER.div}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <a href="KPI Dashboard.html" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
                  {Icon.arrowL} <span className="hidden sm:inline">Dashboard</span>
                </a>
                <span className="text-gray-300">/</span>
                <span className="text-sm font-semibold text-gray-800">HoDiv Review</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="relative grid h-9 w-9 place-items-center rounded-xl hover:bg-gray-100 text-gray-500">
                  {Icon.bell}
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error-500" />
                </button>
                <Avatar initials={REVIEWER.initials} size="sm" tone="brand" />
              </div>
            </div>
          </header>

          {/* Hero */}
          <div className="border-b border-gray-200 bg-white px-6 py-5">
            <div className="mb-4">
              <ApprovalSteps status="hodiv_review" />
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar initials={EMPLOYEE.initials} size="lg" tone="gray" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{EMPLOYEE.name}</h1>
                  <p className="text-sm text-gray-500">{EMPLOYEE.position} · {EMPLOYEE.squad}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Self</p>
                  <p className="mt-0.5 text-lg font-bold text-gray-700">{wSelf}</p>
                </div>
                <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-500">SL</p>
                  <p className="mt-0.5 text-lg font-bold text-violet-700">{wSL}</p>
                </div>
                <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-600">HoD</p>
                  <p className="mt-0.5 text-lg font-bold text-teal-700">{wHoD}</p>
                </div>
                <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">HoDiv</p>
                  <p className="mt-0.5 text-lg font-bold text-brand-700">{wHoDiv ?? '—'}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              <Badge tone="brand">{CYCLE.short}</Badge>
              <Badge tone={reviewedCnt===kras.length?'success':'warning'}>{reviewedCnt}/{kras.length} KRAs reviewed</Badge>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* KRA list */}
            <nav className="hidden w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 py-4 md:flex md:flex-col">
              {kras.map(k => (
                <button key={k.id} onClick={()=>{setActive(k.id);setOverall(false);}}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${activeKraId===k.id&&!showOverall?'bg-white text-brand-700 shadow-sm':'hover:bg-white/60 text-gray-600'}`}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${k.hodiv_score>0?'bg-success-100 text-success-700':'bg-gray-200 text-gray-500'}`}>
                    {k.hodiv_score>0?Icon.checkSm:kras.indexOf(k)+1}
                  </span>
                  <span className="truncate text-xs font-medium">{k.title}</span>
                </button>
              ))}
              <button onClick={()=>setOverall(true)}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${showOverall?'bg-white text-brand-700 shadow-sm':'hover:bg-white/60 text-gray-600'}`}>
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${overallComment&&finalScore>0?'bg-success-100 text-success-700':'bg-gray-200 text-gray-500'}`}>
                  {overallComment&&finalScore>0?Icon.checkSm:'★'}
                </span>
                <span className="text-xs font-medium">Overall Assessment</span>
              </button>
            </nav>

            {/* Content pane */}
            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
                {showOverall
                  ? <OverallAssessment overallComment={overallComment} onChange={setOC} finalScore={finalScore} onFinalScore={setFinalScore} />
                  : active && <KRAReview kra={active} onChange={patch=>update(active.id,patch)} />
                }
              </div>

              {/* Footer nav */}
              <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
                <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
                  <button onClick={onPrev}
                    disabled={!showOverall && kras.indexOf(active)===0}
                    className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
                    {Icon.arrowL} Prev
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Send back dropdown */}
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button onClick={()=>{setSBT('HoD');setSBO(true);}}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                        {Icon.undo} Send back to HoD
                      </button>
                      <div className="w-px bg-gray-300" />
                      <button onClick={()=>{setSBT('SL');setSBO(true);}}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                        {Icon.undo} SL
                      </button>
                    </div>

                    {showOverall ? (
                      <button onClick={()=>{ if(canApprove) setDone(true); }} disabled={!canApprove}
                        className="flex items-center gap-1.5 rounded-lg bg-success-600 px-5 py-2 text-sm font-semibold text-white hover:bg-success-700 disabled:cursor-not-allowed disabled:opacity-50">
                        {Icon.check} Complete Appraisal
                      </button>
                    ) : (
                      <button onClick={onNext}
                        className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                        {showOverall?'Review':'Next'} {Icon.chev}
                      </button>
                    )}
                  </div>
                </div>

                {/* Approval checklist */}
                {showOverall && (
                  <div className="mx-auto mt-4 max-w-2xl">
                    <div className="flex flex-wrap gap-3">
                      {[
                        { ok: allReviewed,               label: `All ${kras.length} KRAs scored` },
                        { ok: finalScore > 0,            label: 'Final calibrated rating set' },
                        { ok: overallComment.trim()!='', label: 'Overall comment written' },
                      ].map((c,i) => (
                        <span key={i} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${c.ok?'bg-success-50 text-success-700':'bg-gray-100 text-gray-500'}`}>
                          <span className={`grid h-4 w-4 place-items-center rounded-full ${c.ok?'bg-success-500 text-white':'bg-gray-300 text-white'}`}>
                            {c.ok?<svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none"><path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>:null}
                          </span>
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <SendBackModal open={sendBackOpen} target={sendBackTarget}
        onConfirm={r=>{ setSBO(false); setToast(`Sent back to ${sendBackTarget} — review restarted.`); }}
        onCancel={()=>setSBO(false)} />
      <Toast msg={toast} onClose={()=>setToast('')} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
