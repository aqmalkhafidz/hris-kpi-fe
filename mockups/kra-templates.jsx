// kra-templates.jsx — Master KRA template builder
const { useState, useMemo } = React;

const HR_USER = { name: 'Sarah Wijaya', role: 'HR Business Partner', initials: 'SW' };

const TEMPLATES = [
  {
    id:'tpl1', code:'ENG-SE-V3', name:'Software Engineer', dept:'Engineering', level:'L3',
    version:'v3', status:'published', updated:'Mar 12, 2026', usedBy: 34, kraCount:6,
    summary:'Backend & full-stack engineers · individual contributor track',
    items: [
      { code:'KRA-1', title:'Delivery & velocity',          weight:25, kpi:'Story points completed vs committed (90% target)' },
      { code:'KRA-2', title:'Code quality',                 weight:20, kpi:'PR review cycle time, defect escape rate' },
      { code:'KRA-3', title:'Reliability & on-call',        weight:15, kpi:'P1 incidents owned, MTTR' },
      { code:'KRA-4', title:'Technical depth',              weight:15, kpi:'Design docs authored, RFC reviews' },
      { code:'KRA-5', title:'Collaboration & mentorship',   weight:15, kpi:'Peer feedback, onboarding contribution' },
      { code:'KRA-6', title:'Continuous learning',          weight:10, kpi:'Certifications, internal talks' },
    ],
  },
  {
    id:'tpl2', code:'ENG-SR-V2', name:'Senior Software Engineer', dept:'Engineering', level:'L4',
    version:'v2', status:'published', updated:'Feb 28, 2026', usedBy: 18, kraCount:6,
    summary:'Tech leads · expected to drive design and uplift the squad',
    items: [
      { code:'KRA-1', title:'Project leadership',           weight:30, kpi:'Initiatives led to ship, on schedule' },
      { code:'KRA-2', title:'Architecture & design',        weight:20, kpi:'Approved RFCs, system reliability' },
      { code:'KRA-3', title:'Code quality & review',        weight:15, kpi:'Review thoroughness, defect rate' },
      { code:'KRA-4', title:'Mentorship',                   weight:15, kpi:'Juniors leveled-up, 360 feedback' },
      { code:'KRA-5', title:'Cross-team impact',            weight:10, kpi:'Squad-spanning improvements' },
      { code:'KRA-6', title:'Hiring & culture',             weight:10, kpi:'Interviews, onboarding score' },
    ],
  },
  {
    id:'tpl3', code:'PRD-PM-V3', name:'Product Manager', dept:'Product', level:'M1',
    version:'v3', status:'published', updated:'Mar 5, 2026', usedBy: 9, kraCount:5,
    summary:'PMs across consumer & growth products',
    items: [
      { code:'KRA-1', title:'Outcome delivery',             weight:30, kpi:'OKR attainment for owned product area' },
      { code:'KRA-2', title:'Discovery & strategy',         weight:20, kpi:'PRDs shipped, customer interviews' },
      { code:'KRA-3', title:'Squad alignment',              weight:20, kpi:'Squad health survey, planning quality' },
      { code:'KRA-4', title:'Stakeholder management',       weight:15, kpi:'Exec & cross-team feedback' },
      { code:'KRA-5', title:'Data & decision making',       weight:15, kpi:'Quality of metric reviews' },
    ],
  },
  {
    id:'tpl4', code:'DES-PD-V2', name:'Product Designer', dept:'Design', level:'L3',
    version:'v2', status:'draft', updated:'Mar 21, 2026', usedBy: 0, kraCount:5,
    summary:'New version under review · adds research weight',
    items: [
      { code:'KRA-1', title:'Design quality',               weight:30, kpi:'Design crit ratings, ship quality' },
      { code:'KRA-2', title:'Research & insights',          weight:20, kpi:'Studies completed, insights cited' },
      { code:'KRA-3', title:'Delivery',                     weight:20, kpi:'On-time handoff to engineering' },
      { code:'KRA-4', title:'Design system contribution',   weight:15, kpi:'Components shipped to system' },
      { code:'KRA-5', title:'Collaboration',                weight:15, kpi:'Peer feedback' },
    ],
  },
  {
    id:'tpl5', code:'MKT-GM-V1', name:'Growth Marketer', dept:'Marketing', level:'L3',
    version:'v1', status:'published', updated:'Jan 18, 2026', usedBy: 8, kraCount:5,
    summary:'Acquisition & lifecycle marketers',
    items: [
      { code:'KRA-1', title:'Acquisition targets',          weight:30, kpi:'Paid + organic signups vs target' },
      { code:'KRA-2', title:'Channel efficiency',           weight:20, kpi:'CAC, ROAS by channel' },
      { code:'KRA-3', title:'Experimentation',              weight:20, kpi:'Tests run, winners shipped' },
      { code:'KRA-4', title:'Lifecycle programs',           weight:15, kpi:'Activation, retention lift' },
      { code:'KRA-5', title:'Reporting & insights',         weight:15, kpi:'Executive readouts, clarity' },
    ],
  },
  {
    id:'tpl6', code:'CS-AS-V2', name:'Customer Success Associate', dept:'Customer Care', level:'L2',
    version:'v2', status:'archived', updated:'Oct 2, 2025', usedBy: 0, kraCount:4,
    summary:'Replaced by v3 in Q4 2025',
    items: [
      { code:'KRA-1', title:'Ticket resolution',            weight:35, kpi:'Resolution time, CSAT' },
      { code:'KRA-2', title:'Quality',                      weight:25, kpi:'QA audit score' },
      { code:'KRA-3', title:'Knowledge contribution',       weight:20, kpi:'KB articles created/updated' },
      { code:'KRA-4', title:'Team collaboration',           weight:20, kpi:'Peer feedback, shift handovers' },
    ],
  },
];

// ── Modal primitives ──
function Modal({ open, onClose, title, subtitle, children, footer, size='md' }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow=''; };
  }, [open, onClose]);
  if (!open) return null;
  const w = size === 'lg' ? 'max-w-3xl' : size === 'sm' ? 'max-w-md' : 'max-w-xl';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${w} max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900`}>
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.x}</button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-white/[0.02]">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
        {label} {required && <span className="text-error-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-gray-400">{hint}</span>}
    </label>
  );
}

const inputCls = 'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90';

function KRAItemModal({ open, onClose, onSave, initial, otherWeight }) {
  const blank = { code:'', title:'', kpi:'', weight:10 };
  const [form, setForm] = React.useState(initial || blank);
  React.useEffect(() => { setForm(initial || blank); }, [initial, open]);
  if (!open) return null;
  const update = (p) => setForm(f => ({ ...f, ...p }));
  const projectedTotal = otherWeight + Number(form.weight || 0);
  const overflow = projectedTotal > 100;
  const valid = form.code.trim() && form.title.trim() && form.kpi.trim() && form.weight > 0 && !overflow;
  return (
    <Modal open={open} onClose={onClose} size="md"
      title={initial ? 'Edit KRA item' : 'Add KRA item'}
      subtitle={initial ? `Editing ${initial.code}` : 'New row in this template · weight contributes to 100% total'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button onClick={()=>{ onSave(form); onClose(); }} disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Add KRA'}
          </button>
        </>
      }>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Code" required>
            <input value={form.code} onChange={e=>update({ code:e.target.value.toUpperCase() })} placeholder="KRA-7" className={inputCls + ' tabular-nums'} />
          </Field>
          <div className="col-span-2">
            <Field label="Weight (%)" required hint={`Other items: ${otherWeight}% · projected total ${projectedTotal}%`}>
              <input type="number" min="1" max="100" value={form.weight} onChange={e=>update({ weight: parseInt(e.target.value||0,10) })} className={inputCls + ' tabular-nums'} />
            </Field>
          </div>
        </div>
        <Field label="KRA title" required>
          <input value={form.title} onChange={e=>update({ title:e.target.value })} placeholder="e.g. Reduce defect escape rate" className={inputCls} />
        </Field>
        <Field label="KPI / measurement" required hint="How will success be measured? Be concrete.">
          <textarea value={form.kpi} onChange={e=>update({ kpi:e.target.value })} rows={3} placeholder="e.g. Defects escaping to prod < 2 per cycle, MTTR < 1h" className={inputCls} />
        </Field>
        {overflow && (
          <div className="rounded-xl border border-error-200 bg-error-50 px-3 py-2 text-xs text-error-700 dark:border-error-900/40 dark:bg-error-500/10 dark:text-error-300">
            Weight overflow: total would be {projectedTotal}%. Reduce other weights or this one.
          </div>
        )}
      </div>
    </Modal>
  );
}

function TemplateModal({ open, onClose, onSave, initial }) {
  const blank = { code:'', name:'', dept:'Engineering', level:'L3', summary:'', status:'draft' };
  const [form, setForm] = React.useState(initial || blank);
  React.useEffect(() => { setForm(initial || blank); }, [initial, open]);
  if (!open) return null;
  const update = (p) => setForm(f => ({ ...f, ...p }));
  const valid = form.code.trim() && form.name.trim();
  return (
    <Modal open={open} onClose={onClose} size="lg"
      title={initial ? `Edit template · ${initial.name}` : 'New KRA template'}
      subtitle={initial ? `Code ${initial.code} · v${parseFloat(String(initial.version||'v1').replace('v',''))}` : 'Bundle of KRAs auto-assigned to a position'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button onClick={()=>{ onSave(form); onClose(); }} disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save template' : 'Create template'}
          </button>
        </>
      }>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Template code" required hint="e.g. ENG-SE-V1">
          <input value={form.code} onChange={e=>update({ code:e.target.value.toUpperCase() })} className={inputCls + ' tabular-nums'} />
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={e=>update({ status:e.target.value })} className={inputCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Position name" required>
          <input value={form.name} onChange={e=>update({ name:e.target.value })} placeholder="Software Engineer" className={inputCls} />
        </Field>
        <Field label="Department">
          <select value={form.dept} onChange={e=>update({ dept:e.target.value })} className={inputCls}>
            {['Engineering','Product','Design','Marketing','Sales','Customer Care','Finance','People (HR)','Logistics'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Level">
          <select value={form.level} onChange={e=>update({ level:e.target.value })} className={inputCls}>
            {['L1','L2','L3','L4','L5','M1','M2','M3'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <div className="col-span-2">
          <Field label="Summary" hint="One-line description shown on the template card">
            <textarea value={form.summary} onChange={e=>update({ summary:e.target.value })} rows={2} className={inputCls} />
          </Field>
        </div>
        <div className="col-span-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
          {initial ? 'KRA items are managed from the detail view — close this and use “Add KRA item”.' : 'After creating, you can add KRA items, set weights (must sum to 100%), and publish.'}
        </div>
      </div>
    </Modal>
  );
}

function StatusBadge({ s }) {
  if (s === 'published') return <Badge tone="success">Published</Badge>;
  if (s === 'draft')     return <Badge tone="warning">Draft</Badge>;
  if (s === 'archived')  return <Badge tone="gray">Archived</Badge>;
  return <Badge tone="gray">{s}</Badge>;
}

function TemplateCard({ t, onOpen, active }) {
  return (
    <button onClick={() => onOpen(t.id)}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        active
          ? 'border-brand-500 bg-brand-50/40 shadow-sm dark:border-brand-500 dark:bg-brand-500/10'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-gray-700'
      }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            {Icon.layers}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{t.dept} · {t.level}</p>
          </div>
        </div>
        <StatusBadge s={t.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{t.summary}</p>
      <div className="mt-4 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1"><code className="rounded bg-gray-100 px-1.5 py-0.5 tabular-nums dark:bg-gray-800 dark:text-gray-300">{t.code}</code></span>
        <span>·</span>
        <span><strong className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">{t.kraCount}</strong> KRAs</span>
        <span>·</span>
        <span>used by <strong className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">{t.usedBy}</strong></span>
      </div>
    </button>
  );
}

function WeightStack({ items }) {
  const palette = ['#465fff','#7c5cff','#10b981','#fdb022','#f97066','#34d399'];
  const total = items.reduce((s,i)=>s+i.weight, 0);
  return (
    <div className="overflow-hidden rounded-full">
      <div className="flex h-3 w-full">
        {items.map((it, i) => (
          <div key={it.code} title={`${it.title} · ${it.weight}%`}
            style={{ width:`${(it.weight/total)*100}%`, background: palette[i % palette.length] }} />
        ))}
      </div>
    </div>
  );
}

function TemplateDetail({ t, onEditTemplate }) {
  const [items, setItems] = useState(t.items);
  const [editingItem, setEditingItem] = useState(null); // existing KRA item
  const [addingItem, setAddingItem] = useState(false);
  // re-sync if template changes
  React.useEffect(() => { setItems(t.items); setEditingItem(null); setAddingItem(false); }, [t.id]);

  const total = items.reduce((s,i)=>s+i.weight, 0);
  const balanced = total === 100;
  const otherWeight = (excludeCode) => items.filter(it => it.code !== excludeCode).reduce((s,i)=>s+i.weight,0);

  const upsertItem = (form) => {
    setItems(prev => {
      const exists = prev.some(it => it.code === (editingItem?.code || form.code));
      if (editingItem) return prev.map(it => it.code === editingItem.code ? { ...it, ...form } : it);
      if (exists) return prev.map(it => it.code === form.code ? { ...it, ...form } : it);
      return [...prev, form];
    });
  };
  const deleteItem = (code) => setItems(prev => prev.filter(it => it.code !== code));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
      {/* Detail header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">{t.code}</code>
            <StatusBadge s={t.status} />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Version {t.version} · updated {t.updated}</span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{t.name}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.summary}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200">
            {Icon.download}<span>Duplicate</span>
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200">
            {Icon.send}<span>Publish v{parseFloat(t.version.replace('v',''))+1}</span>
          </button>
          <button onClick={onEditTemplate} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-semibold text-white hover:bg-brand-600">
            {Icon.edit}<span>Edit template</span>
          </button>
        </div>
      </div>

      {/* Meta + weights */}
      <div className="grid grid-cols-1 gap-6 border-b border-gray-200 px-6 py-5 dark:border-gray-800 lg:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Applies to</p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{t.dept} · {t.level}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Auto-assigned to matching positions</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Used by</p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{t.usedBy} employees</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">In the active Q1 2026 cycle</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Weight allocation</p>
          <div className="mt-2"><WeightStack items={items} /></div>
          <p className={`mt-1.5 text-xs ${balanced ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
            Total {total}% {balanced ? '· balanced' : '· must equal 100%'}
          </p>
        </div>
      </div>

      {/* KRA items */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="px-6 py-3 w-10" />
              <th className="px-3 py-3">Code</th>
              <th className="px-3 py-3">KRA</th>
              <th className="px-3 py-3">KPI / measurement</th>
              <th className="px-3 py-3 text-right">Weight</th>
              <th className="px-6 py-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.code} className="border-b border-gray-100 last:border-0 dark:border-gray-800/60">
                <td className="px-6 py-4 text-center text-gray-300 dark:text-gray-600">
                  <span className="cursor-grab select-none text-base leading-none">⋮⋮</span>
                </td>
                <td className="px-3 py-4">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">{it.code}</code>
                </td>
                <td className="px-3 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{it.title}</p>
                </td>
                <td className="px-3 py-4 text-gray-600 dark:text-gray-300">{it.kpi}</td>
                <td className="px-3 py-4 text-right">
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                    {it.weight}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button onClick={()=>setEditingItem(it)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
                    <button onClick={()=>{ if (confirm(`Delete ${it.code} — ${it.title}?`)) deleteItem(it.code); }} className="rounded p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10">{Icon.trash}</button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={6} className="px-6 py-3">
                <button onClick={()=>setAddingItem(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:bg-brand-500/10 dark:hover:text-brand-300">
                  {Icon.plus}<span>Add KRA item</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rating scale */}
      <div className="border-t border-gray-200 px-6 py-5 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Rating scale</p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">5-point scale shared across all templates</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
          {[
            { n:1, label:'Below', desc:'Did not meet expectations',           tone:'#f04438' },
            { n:2, label:'Partial', desc:'Met some expectations',             tone:'#f97066' },
            { n:3, label:'Meets', desc:'Met expectations consistently',       tone:'#fdb022' },
            { n:4, label:'Exceeds', desc:'Exceeded in most areas',            tone:'#84cc16' },
            { n:5, label:'Outstanding', desc:'Exceeded in all areas',         tone:'#12b76a' },
          ].map(s => (
            <div key={s.n} className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: s.tone }}>{s.n}</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.label}</p>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Approval chain */}
      <div className="grid grid-cols-1 gap-4 border-t border-gray-200 px-6 py-5 dark:border-gray-800 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Approval chain</p>
          <ol className="mt-2 space-y-1.5 text-sm">
            {['Self appraisal','Squad Leader','Head of Department','Head of Division'].map((s,i)=>(
              <li key={s} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">{i+1}</span>
                <span className="text-gray-700 dark:text-gray-200">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Evidence required</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
            <li className="flex items-center gap-2"><span className="text-success-500">{Icon.check}</span>Per-KRA narrative comment</li>
            <li className="flex items-center gap-2"><span className="text-success-500">{Icon.check}</span>At least 1 evidence link or file</li>
            <li className="flex items-center gap-2"><span className="text-success-500">{Icon.check}</span>Final reflection</li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Cycle defaults</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
            <li>Quarterly · 3-month review window</li>
            <li>Self-deadline: cycle end −7 days</li>
            <li>Locked after HoDiv approval</li>
          </ul>
        </div>
      </div>

      <KRAItemModal
        open={addingItem}
        onClose={()=>setAddingItem(false)}
        onSave={upsertItem}
        initial={null}
        otherWeight={total}
      />
      <KRAItemModal
        open={!!editingItem}
        onClose={()=>setEditingItem(null)}
        onSave={upsertItem}
        initial={editingItem}
        otherWeight={editingItem ? otherWeight(editingItem.code) : total}
      />
    </div>
  );
}

function App() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState(TEMPLATES);
  const [activeId, setActiveId] = useState('tpl1');
  const [creating, setCreating] = useState(false);
  const [editingTpl, setEditingTpl] = useState(null);

  const visible = useMemo(() => {
    return templates.filter(t => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (search && !(t.name+t.code+t.dept).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filter, search, templates]);

  const active = templates.find(t => t.id === activeId) || templates[0];

  const upsertTemplate = (form) => {
    setTemplates(prev => {
      if (editingTpl) return prev.map(t => t.id === editingTpl.id ? { ...t, ...form } : t);
      const nid = `tpl${prev.length + 1}`;
      const created = {
        ...form, id: nid, version:'v1', updated:'today', usedBy:0, kraCount:0, items:[],
      };
      return [...prev, created];
    });
    if (!editingTpl) setActiveId(`tpl${templates.length + 1}`);
  };

  const primary = (
    <button onClick={()=>setCreating(true)} className="hidden md:inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
      {Icon.plus}<span>New template</span>
    </button>
  );

  const filters = [
    { id:'all',       label:'All',       count: templates.length },
    { id:'published', label:'Published', count: templates.filter(t=>t.status==='published').length },
    { id:'draft',     label:'Draft',     count: templates.filter(t=>t.status==='draft').length },
    { id:'archived',  label:'Archived',  count: templates.filter(t=>t.status==='archived').length },
  ];

  return (
    <PageShell active="templates" user={HR_USER} primary={primary} brandHue="indigo">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Master data</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">KRA Templates</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Per-position KRA bundles. Linked to positions; auto-assigned to employees when a cycle starts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icon.search}</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search templates…"
              className="h-10 w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200" />
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map(f => (
          <button key={f.id} onClick={()=>setFilter(f.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.id
                ? 'bg-brand-500 text-white'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-white/[0.02] dark:text-gray-300 dark:ring-gray-800'
            }`}>
            {f.label}
            <span className={filter === f.id ? 'rounded bg-white/20 px-1.5 py-0.5 text-[10px]' : 'rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400'}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Two-column: list + detail */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-4">
          {visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
              No templates match your filter.
            </div>
          )}
          {visible.map(t => (
            <TemplateCard key={t.id} t={t} onOpen={setActiveId} active={t.id === activeId} />
          ))}
        </div>
        <div className="xl:col-span-8">
          <TemplateDetail t={active} onEditTemplate={()=>setEditingTpl(active)} />
        </div>
      </div>

      <TemplateModal open={creating} onClose={()=>setCreating(false)} onSave={upsertTemplate} initial={null} />
      <TemplateModal open={!!editingTpl} onClose={()=>setEditingTpl(null)} onSave={upsertTemplate} initial={editingTpl} />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
