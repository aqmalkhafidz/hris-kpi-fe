// distribution.jsx — Distribute appraisals from active cycles to eligible employees
const { useState, useMemo } = React;

const HR_USER = { name: 'Sarah Wijaya', role: 'HR Business Partner', initials: 'SW' };

const CYCLES = [
  { id:'cyc1', name:'Q1 2026 Appraisal',          status:'active', distributedAt:'2026-01-08', startDate:'2026-01-01', endDate:'2026-03-31' },
  { id:'cyc4', name:'Probation Reviews · Mar 2026', status:'active', distributedAt:'2026-03-02', startDate:'2026-03-01', endDate:'2026-03-31' },
  { id:'cyc3', name:'Mid-Year 2026 (H1)',          status:'draft',  distributedAt:null,         startDate:'2026-04-01', endDate:'2026-06-30' },
];

const TEMPLATES = [
  { id:'tpl1', code:'ENG-SE-V3', division:'Technology', position:'Software Engineer',         name:'Engineering · SWE · v3' },
  { id:'tpl2', code:'ENG-SR-V2', division:'Technology', position:'Senior Software Engineer',  name:'Engineering · Senior SWE · v2' },
  { id:'tpl3', code:'PRD-PM-V3', division:'Technology', position:'Product Manager',           name:'Product · PM · v3' },
  { id:'tpl4', code:'DES-PD-V2', division:'Technology', position:'Product Designer',          name:'Design · Product Designer · v2' },
  { id:'tpl5', code:'MKT-GM-V1', division:'Business',   position:'Growth Marketer',           name:'Marketing · Growth · v1' },
  { id:'tpl6', code:'CS-AS-V3',  division:'Business',   position:'Customer Success Associate',name:'Customer Care · Associate · v3' },
  { id:'tpl7', code:'FIN-AC-V1', division:'Corporate',  position:'Accountant',                name:'Finance · Accountant · v1' },
];

const EMPLOYEES = [
  { id:'e1',  nip:'EMP-2021-0341', name:'Aqmal Hidayat',     dept:'Engineering',   division:'Technology', position:'Software Engineer',         sl:'Rifky Oktaviano', hod:'Dewi Larasati',  hodiv:'Bastian Aritonang' },
  { id:'e2',  nip:'EMP-2020-0218', name:'Rifky Oktaviano',   dept:'Engineering',   division:'Technology', position:'Senior Software Engineer',  sl:null,              hod:'Dewi Larasati',  hodiv:'Bastian Aritonang' },
  { id:'e3',  nip:'EMP-2018-0042', name:'Dewi Larasati',     dept:'Engineering',   division:'Technology', position:'Engineering Manager',       sl:null,              hod:null,              hodiv:'Bastian Aritonang' },
  { id:'e4',  nip:'EMP-2022-0512', name:'Kirana Andini',     dept:'Design',        division:'Technology', position:'Product Designer',          sl:'Naomi Salim',     hod:'Naomi Salim',     hodiv:'Bastian Aritonang' },
  { id:'e5',  nip:'EMP-2023-0701', name:'Reno Saputra',      dept:'Engineering',   division:'Technology', position:'Software Engineer',         sl:'Rifky Oktaviano', hod:'Dewi Larasati',  hodiv:'Bastian Aritonang' },
  { id:'e6',  nip:'EMP-2019-0188', name:'Hendra Wijoyo',     dept:'Product',       division:'Technology', position:'Product Manager',           sl:null,              hod:'Hendra Wijoyo',   hodiv:'Bastian Aritonang' },
  { id:'e7',  nip:'EMP-2024-0903', name:'Mira Lestari',      dept:'Finance',       division:'Corporate',  position:'Accountant',                sl:'Maya Setyowati',  hod:'Maya Setyowati',  hodiv:'Larasati Putri' },
  { id:'e8',  nip:'EMP-2022-0420', name:'Bagas Widodo',      dept:'Customer Care', division:'Business',   position:'Customer Success Associate',sl:'Aulia Hapsari',   hod:'Aulia Hapsari',   hodiv:'Indah Rahmawati' },
  { id:'e9',  nip:'EMP-2023-0815', name:'Citra Pertiwi',     dept:'Marketing',     division:'Business',   position:'Growth Marketer',           sl:'Tania Kurniawan', hod:'Tania Kurniawan', hodiv:'Indah Rahmawati' },
  { id:'e10', nip:'EMP-2025-1102', name:'Yoga Pradana',      dept:'Engineering',   division:'Technology', position:'Software Engineer',         sl:'Rifky Oktaviano', hod:'Dewi Larasati',  hodiv:'Bastian Aritonang' },
  { id:'e11', nip:'EMP-2024-0411', name:'Rangga Permana',    dept:'Sales',         division:'Business',   position:'Sales Lead',                sl:null,              hod:'Rangga Permana',  hodiv:'Indah Rahmawati' },
  { id:'e12', nip:'EMP-2025-0303', name:'Putri Anggraeni',   dept:'Logistics',     division:'Operations', position:'Logistics Coordinator',     sl:'Bayu Setiawan',   hod:'Bayu Setiawan',   hodiv:'Yusuf Pranata' },
];

const INITIAL_DISTRIBUTED = {
  cyc1: [],
  cyc4: ['e7'],
  cyc3: [],
};

function StatusBadge({ s }) {
  if (s === 'matched')               return <Badge tone="success">Matched</Badge>;
  if (s === 'skipped_no_template')   return <Badge tone="warning">No template</Badge>;
  if (s === 'skipped_already')       return <Badge tone="gray">Already</Badge>;
  if (s === 'skipped_no_reviewer')   return <Badge tone="error">No reviewer</Badge>;
  return <Badge tone="gray">{s}</Badge>;
}

function StatTile({ label, value, sub, tone='brand' }) {
  const tones = {
    brand:   'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
    error:   'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-300',
    gray:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
      <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-2 inline-flex items-center gap-2 rounded-lg px-2 py-0.5 text-2xl font-bold tabular-nums ${tones[tone]}`}>{value}</p>
      {sub && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
    </div>
  );
}

function simulate(cycle, distributedSet) {
  return EMPLOYEES.map(emp => {
    if (distributedSet.has(emp.id)) {
      return { employee: emp, status:'skipped_already', template: null,
               reason:`Sudah punya appraisal untuk ${cycle.name}` };
    }
    const tpl = TEMPLATES.find(t => t.division === emp.division && t.position === emp.position);
    if (!tpl) {
      return { employee: emp, status:'skipped_no_template', template: null,
               reason:`Belum ada template aktif untuk ${emp.division} · ${emp.position}` };
    }
    if (!emp.sl && !emp.hod && !emp.hodiv) {
      return { employee: emp, status:'skipped_no_reviewer', template: tpl,
               reason:'Tidak ada reviewer valid (SL/HoD/HoDiv kosong)' };
    }
    return { employee: emp, status:'matched', template: tpl, reason: null };
  });
}

function ReviewerChain({ emp }) {
  const steps = [
    { label:'SL',    name: emp.sl },
    { label:'HoD',   name: emp.hod },
    { label:'HoDiv', name: emp.hodiv },
  ];
  return (
    <div className="flex items-center gap-1.5 text-[11px]">
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <span className="text-gray-300 dark:text-gray-600">→</span>}
          <span className={s.name
            ? 'inline-flex items-center gap-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            : 'inline-flex items-center gap-1 rounded-md bg-error-50 px-1.5 py-0.5 text-error-700 dark:bg-error-500/10 dark:text-error-400'
          }>
            <strong className="font-semibold uppercase tracking-wider opacity-70">{s.label}</strong>
            <span className="tabular-nums">{s.name || '—'}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState('cyc1');
  const [distributed, setDistributed] = useState(() => {
    const m = {};
    Object.entries(INITIAL_DISTRIBUTED).forEach(([k,v]) => m[k] = new Set(v));
    return m;
  });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const cycle = CYCLES.find(c => c.id === selectedId) || CYCLES[0];
  const distributedSet = distributed[cycle.id] || new Set();
  const preview = useMemo(() => simulate(cycle, distributedSet), [cycle, distributedSet]);

  const stats = useMemo(() => {
    const t = { total: preview.length, matched:0, no_template:0, already:0, no_reviewer:0 };
    preview.forEach(r => {
      if (r.status === 'matched')             t.matched++;
      if (r.status === 'skipped_no_template') t.no_template++;
      if (r.status === 'skipped_already')     t.already++;
      if (r.status === 'skipped_no_reviewer') t.no_reviewer++;
    });
    return t;
  }, [preview]);

  const visible = useMemo(() => {
    return preview.filter(r => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!(r.employee.name + r.employee.nip + r.employee.position + r.employee.dept).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [preview, filter, search]);

  const isActive = cycle.status === 'active';
  const canRun = isActive && stats.matched > 0 && !running;

  const runDistribution = () => {
    if (!canRun) return;
    setRunning(true);
    setTimeout(() => {
      setDistributed(prev => {
        const next = { ...prev };
        const set = new Set(next[cycle.id] || []);
        preview.forEach(r => { if (r.status === 'matched') set.add(r.employee.id); });
        next[cycle.id] = set;
        return next;
      });
      setLastRun({
        cycleId: cycle.id, when: new Date().toLocaleString('en-GB'),
        matched: stats.matched, skipped_no_template: stats.no_template, skipped_already: stats.already,
      });
      setRunning(false);
    }, 700);
  };

  const filters = [
    { id:'all',                 label:'All',          count: stats.total },
    { id:'matched',             label:'Matched',      count: stats.matched },
    { id:'skipped_no_template', label:'No template',  count: stats.no_template },
    { id:'skipped_already',     label:'Already',      count: stats.already },
    { id:'skipped_no_reviewer', label:'No reviewer',  count: stats.no_reviewer },
  ];

  const primary = (
    <button onClick={runDistribution} disabled={!canRun}
      className="hidden md:inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
      {Icon.send}<span>{running ? 'Distributing…' : 'Distribute Now'}</span>
    </button>
  );

  return (
    <PageShell active="distribution" user={HR_USER} primary={primary} brandHue="indigo">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Appraisal setup</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Distribution</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate appraisal draft untuk semua employee aktif yang match template <code>division + position</code>.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pilih cycle</label>
            <select value={selectedId} onChange={e=>{ setSelectedId(e.target.value); setFilter('all'); setLastRun(null); }}
              className="mt-1.5 h-11 w-full max-w-md rounded-xl border border-gray-300 bg-white px-3.5 text-sm font-semibold text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
              {CYCLES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.status}{c.distributedAt ? ` · distributed ${c.distributedAt}` : ''}
                </option>
              ))}
            </select>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Badge tone={cycle.status === 'active' ? 'success' : 'warning'}>{cycle.status}</Badge>
              <span>{cycle.startDate} → {cycle.endDate}</span>
              <span>·</span>
              <span>{stats.total} employee aktif</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button onClick={runDistribution} disabled={!canRun}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
              {Icon.send}<span>{running ? 'Distributing…' : 'Distribute Now'}</span>
            </button>
            {!isActive && (
              <p className="text-[11px] text-warning-700 dark:text-warning-400">
                Cycle harus <code>active</code> untuk bisa distribusi. Aktifkan dari <a href="Cycles.html" className="underline">Cycles</a>.
              </p>
            )}
            {isActive && stats.matched === 0 && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Tidak ada employee yang match (semua sudah ter-distribusi atau tidak ada template).</p>
            )}
          </div>
        </div>

        {lastRun && lastRun.cycleId === cycle.id && (
          <div className="mt-4 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-300">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-semibold inline-flex items-center gap-1">{Icon.check} Distribusi selesai · {lastRun.when}</span>
              <span><strong className="tabular-nums">{lastRun.matched}</strong> appraisal terbentuk</span>
              <span>·</span>
              <span><strong className="tabular-nums">{lastRun.skipped_no_template}</strong> skipped (no template)</span>
              <span>·</span>
              <span><strong className="tabular-nums">{lastRun.skipped_already}</strong> skipped (already)</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile label="Total employees" value={stats.total} tone="gray" />
        <StatTile label="Matched" value={stats.matched} sub="Akan dapat appraisal draft" tone="success" />
        <StatTile label="No template" value={stats.no_template} sub="Bikin template dulu" tone="warning" />
        <StatTile label="Already" value={stats.already} sub="Sudah punya appraisal" tone="gray" />
        <StatTile label="No reviewer" value={stats.no_reviewer} sub="Routing kosong" tone="error" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icon.search}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search employees…"
            className="h-10 w-72 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left dark:border-gray-800">
                <th className="px-5 py-3">Employee</th>
                <th className="px-3 py-3">Position</th>
                <th className="px-3 py-3">Template match</th>
                <th className="px-3 py-3">Reviewer chain</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">Tidak ada employee untuk filter ini.</td></tr>
              )}
              {visible.map(r => (
                <tr key={r.employee.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={r.employee.name.split(' ').map(w=>w[0]).slice(0,2).join('')} size="sm" tone="brand" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{r.employee.name}</p>
                        <p className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400">{r.employee.nip} · {r.employee.dept}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{r.employee.position}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{r.employee.division}</p>
                  </td>
                  <td className="px-3 py-3">
                    {r.template ? (
                      <div>
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">{r.template.code}</code>
                        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{r.template.name}</p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3"><ReviewerChain emp={r.employee} /></td>
                  <td className="px-3 py-3"><StatusBadge s={r.status} /></td>
                  <td className="px-5 py-3 text-[11px] text-gray-500 dark:text-gray-400">{r.reason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
        <p className="font-semibold text-gray-700 dark:text-gray-200">Logika distribusi</p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          <li>Match template berdasarkan kombinasi <code>division + position</code> employee.</li>
          <li>Snapshot reviewer (SL/HoD/HoDiv) di-copy ke appraisal saat distribusi, bukan live-read.</li>
          <li>Employee di-skip kalau sudah punya appraisal di cycle yang sama.</li>
          <li>Setelah distribusi, employee bisa isi self appraisal di <a href="Self Appraisal.html" className="underline">My Appraisals</a>.</li>
        </ul>
      </div>
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
