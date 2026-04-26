// cycles.jsx — Appraisal cycle CRUD + activation
const { useState, useMemo } = React;

const HR_USER = { name: 'Sarah Wijaya', role: 'HR Business Partner', initials: 'SW' };

const SEED_CYCLES = [
  {
    id:'cyc1', name:'Q1 2026 Appraisal',
    startDate:'2026-01-01', endDate:'2026-03-31',
    selfDeadline:'2026-03-24',
    status:'active',
    description:'Performance review for Q1 2026 · all divisions',
    distributedAt:'2026-01-08', totalAppraisals: 248,
    completed: 28, inReview: 124, draft: 96, notDistributed: 0,
  },
  {
    id:'cyc2', name:'Q4 2025 Appraisal',
    startDate:'2025-10-01', endDate:'2025-12-31',
    selfDeadline:'2025-12-22',
    status:'closed',
    description:'Year-end review · closed Jan 12 2026',
    distributedAt:'2025-10-06', totalAppraisals: 231,
    completed: 231, inReview: 0, draft: 0, notDistributed: 0,
  },
  {
    id:'cyc3', name:'Mid-Year 2026 (H1)',
    startDate:'2026-04-01', endDate:'2026-06-30',
    selfDeadline:'2026-06-22',
    status:'draft',
    description:'Mid-year check-in · not yet distributed',
    distributedAt:null, totalAppraisals: 0,
    completed: 0, inReview: 0, draft: 0, notDistributed: 0,
  },
  {
    id:'cyc4', name:'Probation Reviews · Mar 2026',
    startDate:'2026-03-01', endDate:'2026-03-31',
    selfDeadline:'2026-03-25',
    status:'active',
    description:'Probationary employees · 7 in scope',
    distributedAt:'2026-03-02', totalAppraisals: 7,
    completed: 2, inReview: 4, draft: 1, notDistributed: 0,
  },
];

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

function StatusBadge({ s }) {
  if (s === 'active')  return <Badge tone="success">Active</Badge>;
  if (s === 'draft')   return <Badge tone="warning">Draft</Badge>;
  if (s === 'closed')  return <Badge tone="gray">Closed</Badge>;
  return <Badge tone="gray">{s}</Badge>;
}

function CycleModal({ open, onClose, onSave, initial }) {
  const blank = {
    name:'', startDate:'', endDate:'', selfDeadline:'',
    status:'draft', description:'',
  };
  const [form, setForm] = React.useState(initial || blank);
  React.useEffect(() => { setForm(initial || blank); }, [initial, open]);
  if (!open) return null;
  const update = (p) => setForm(f => ({ ...f, ...p }));
  const valid = form.name.trim() && form.startDate && form.endDate
    && new Date(form.startDate) <= new Date(form.endDate);
  return (
    <Modal open={open} onClose={onClose} size="lg"
      title={initial ? `Edit cycle · ${initial.name}` : 'New appraisal cycle'}
      subtitle={initial ? `Status ${initial.status}` : 'Defines the review window. Distribute later from the Distribution page.'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button onClick={()=>{ onSave(form); onClose(); }} disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Create cycle'}
          </button>
        </>
      }>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Field label="Cycle name" required hint="e.g. Q2 2026 Appraisal">
            <input value={form.name} onChange={e=>update({ name:e.target.value })} placeholder="Q2 2026 Appraisal" className={inputCls} />
          </Field>
        </div>
        <Field label="Start date" required>
          <input type="date" value={form.startDate} onChange={e=>update({ startDate:e.target.value })} className={inputCls + ' tabular-nums'} />
        </Field>
        <Field label="End date" required>
          <input type="date" value={form.endDate} onChange={e=>update({ endDate:e.target.value })} className={inputCls + ' tabular-nums'} />
        </Field>
        <Field label="Self-appraisal deadline" hint="Default: end date − 7 days">
          <input type="date" value={form.selfDeadline} onChange={e=>update({ selfDeadline:e.target.value })} className={inputCls + ' tabular-nums'} />
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={e=>update({ status:e.target.value })} className={inputCls}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </Field>
        <div className="col-span-2">
          <Field label="Description" hint="Visible on dashboards and report headers">
            <textarea value={form.description} onChange={e=>update({ description:e.target.value })} rows={2} className={inputCls} />
          </Field>
        </div>
        <div className="col-span-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
          Distribusi hanya jalan untuk cycle ber-status <code className="rounded bg-white px-1 dark:bg-gray-800">active</code>. Setelah distribusi, snapshot reviewer dan KRA template akan di-copy ke setiap appraisal.
        </div>
      </div>
    </Modal>
  );
}

function ProgressBar({ items }) {
  const total = items.reduce((s,i)=>s+i.value,0) || 1;
  return (
    <div className="overflow-hidden rounded-full">
      <div className="flex h-2 w-full">
        {items.map((it) => (
          <div key={it.label} title={`${it.label} · ${it.value}`}
            style={{ width:`${(it.value/total)*100}%`, background: it.tone }} />
        ))}
      </div>
    </div>
  );
}

function CycleCard({ c, onEdit, onActivate, onClose, onDelete }) {
  const inProgress = c.status === 'active' && c.totalAppraisals > 0;
  const completionPct = c.totalAppraisals > 0
    ? Math.round((c.completed / c.totalAppraisals) * 100)
    : 0;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <StatusBadge s={c.status} />
            <span className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
              {c.startDate} → {c.endDate}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{c.name}</h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{c.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {c.status === 'draft' && (
            <button onClick={()=>onActivate(c.id)} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success-600 px-3 text-xs font-semibold text-white hover:bg-success-700">
              {Icon.send}<span>Activate</span>
            </button>
          )}
          {c.status === 'active' && (
            <button onClick={()=>onClose(c.id)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200">
              {Icon.check}<span>Close cycle</span>
            </button>
          )}
          <button onClick={()=>onEdit(c)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200">
            {Icon.edit}<span>Edit</span>
          </button>
          {c.status === 'draft' && c.totalAppraisals === 0 && (
            <button onClick={()=>onDelete(c.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-error-300 hover:bg-error-50 hover:text-error-600 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-error-500/40 dark:hover:bg-error-500/10">
              {Icon.trash}
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Distributed</p>
          <p className="mt-1 text-base font-semibold tabular-nums text-gray-900 dark:text-white">
            {c.distributedAt || <span className="text-gray-400">—</span>}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Self deadline</p>
          <p className="mt-1 text-base font-semibold tabular-nums text-gray-900 dark:text-white">
            {c.selfDeadline || <span className="text-gray-400">—</span>}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Appraisals</p>
          <p className="mt-1 text-base font-semibold tabular-nums text-gray-900 dark:text-white">
            {c.totalAppraisals}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Completion</p>
          <p className="mt-1 text-base font-semibold tabular-nums text-gray-900 dark:text-white">
            {completionPct}<span className="text-xs text-gray-400">%</span>
          </p>
        </div>
      </div>

      {inProgress && (
        <div className="mt-4">
          <ProgressBar items={[
            { label:'Completed', value:c.completed,    tone:'#12b76a' },
            { label:'In review', value:c.inReview,     tone:'#465fff' },
            { label:'Draft',     value:c.draft,        tone:'#fdb022' },
            { label:'Pending',   value:Math.max(0, c.totalAppraisals - c.completed - c.inReview - c.draft), tone:'#e2dccb' },
          ]} />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
            <span><span className="inline-block h-1.5 w-1.5 rounded-full" style={{background:'#12b76a'}}/> {c.completed} completed</span>
            <span><span className="inline-block h-1.5 w-1.5 rounded-full" style={{background:'#465fff'}}/> {c.inReview} in review</span>
            <span><span className="inline-block h-1.5 w-1.5 rounded-full" style={{background:'#fdb022'}}/> {c.draft} draft</span>
          </div>
        </div>
      )}

      {c.status === 'active' && c.totalAppraisals === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-warning-300 bg-warning-50 px-4 py-3 text-xs text-warning-700 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-300">
          Cycle aktif tapi belum ada appraisal yang ter-distribusi. Buka <a href="Distribution.html" className="underline font-semibold">Distribution</a> untuk menjalankan distribusi.
        </div>
      )}
    </div>
  );
}

function App() {
  const [cycles, setCycles] = useState(SEED_CYCLES);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingCyc, setEditingCyc] = useState(null);

  const visible = useMemo(() => cycles.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !(c.name+c.description).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [cycles, filter, search]);

  const upsert = (form) => {
    setCycles(prev => {
      if (editingCyc) return prev.map(c => c.id === editingCyc.id ? { ...c, ...form } : c);
      const nid = `cyc${Date.now()}`;
      const created = {
        ...form, id: nid,
        distributedAt: null, totalAppraisals: 0,
        completed: 0, inReview: 0, draft: 0, notDistributed: 0,
      };
      return [created, ...prev];
    });
  };
  const activate = (id) => setCycles(prev => prev.map(c => c.id === id ? { ...c, status:'active' } : c));
  const closeCyc = (id) => {
    if (!confirm('Tutup cycle ini? Appraisal yang belum complete tetap tersimpan tapi cycle tidak akan distribusi lagi.')) return;
    setCycles(prev => prev.map(c => c.id === id ? { ...c, status:'closed' } : c));
  };
  const remove = (id) => {
    if (!confirm('Hapus cycle draft ini? Tidak bisa di-undo.')) return;
    setCycles(prev => prev.filter(c => c.id !== id));
  };

  const stats = {
    total: cycles.length,
    active: cycles.filter(c => c.status === 'active').length,
    draft: cycles.filter(c => c.status === 'draft').length,
    closed: cycles.filter(c => c.status === 'closed').length,
  };

  const filters = [
    { id:'all',    label:'All',    count: stats.total },
    { id:'active', label:'Active', count: stats.active },
    { id:'draft',  label:'Draft',  count: stats.draft },
    { id:'closed', label:'Closed', count: stats.closed },
  ];

  const primary = (
    <button onClick={()=>setCreating(true)} className="hidden md:inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
      {Icon.plus}<span>New cycle</span>
    </button>
  );

  return (
    <PageShell active="cycles" user={HR_USER} primary={primary} brandHue="indigo">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Appraisal setup</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Cycles</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Periode appraisal. Aktifkan cycle dulu sebelum bisa di-distribusikan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setCreating(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 md:hidden">
            {Icon.plus}<span>New</span>
          </button>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icon.search}</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cycles…"
              className="h-10 w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label:'Total cycles', value: stats.total,  tone:'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300', icon: Icon.clock },
          { label:'Active',       value: stats.active, tone:'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300', icon: Icon.send },
          { label:'Draft',        value: stats.draft,  tone:'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300', icon: Icon.edit },
          { label:'Closed',       value: stats.closed, tone:'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300', icon: Icon.check },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.tone}`}>{s.icon}</span>
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

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

      <div className="space-y-4">
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
            Tidak ada cycle untuk filter ini.
          </div>
        )}
        {visible.map(c => (
          <CycleCard key={c.id} c={c}
            onEdit={setEditingCyc}
            onActivate={activate}
            onClose={closeCyc}
            onDelete={remove}
          />
        ))}
      </div>

      <CycleModal open={creating} onClose={()=>setCreating(false)} onSave={upsert} initial={null} />
      <CycleModal open={!!editingCyc} onClose={()=>setEditingCyc(null)} onSave={upsert} initial={editingCyc} />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
