// organization.jsx — Master data for org structure + employees
const { useState, useMemo } = React;

const HR_USER = { name: 'Sarah Wijaya', role: 'HR Business Partner', initials: 'SW' };

// Org tree
const DIVISIONS = [
  { id:'tech',    name:'Technology',  head:'Bastian Aritonang', headcount:134, departments:['Engineering','Product','Design','QA'] },
  { id:'biz',     name:'Business',    head:'Indah Rahmawati',   headcount:68,  departments:['Marketing','Sales','Customer Care'] },
  { id:'ops',     name:'Operations',  head:'Yusuf Pranata',     headcount:47,  departments:['Logistics','Procurement'] },
  { id:'corp',    name:'Corporate',   head:'Larasati Putri',    headcount:26,  departments:['Finance','People (HR)','Legal'] },
];

const DEPARTMENTS = [
  { id:'eng',  name:'Engineering',   division:'Technology', hod:'Dewi Larasati',     positions:6,  headcount:84 },
  { id:'prod', name:'Product',       division:'Technology', hod:'Hendra Wijoyo',     positions:4,  headcount:32 },
  { id:'des',  name:'Design',        division:'Technology', hod:'Naomi Salim',       positions:3,  headcount:18 },
  { id:'mkt',  name:'Marketing',     division:'Business',   hod:'Tania Kurniawan',   positions:5,  headcount:21 },
  { id:'sal',  name:'Sales',         division:'Business',   hod:'Rangga Permana',    positions:5,  headcount:27 },
  { id:'cs',   name:'Customer Care', division:'Business',   hod:'Aulia Hapsari',     positions:3,  headcount:20 },
  { id:'log',  name:'Logistics',     division:'Operations', hod:'Bayu Setiawan',     positions:4,  headcount:31 },
  { id:'fin',  name:'Finance',       division:'Corporate',  hod:'Maya Setyowati',    positions:4,  headcount:14 },
  { id:'hr',   name:'People (HR)',   division:'Corporate',  hod:'Sarah Wijaya',      positions:3,  headcount:12 },
];

const POSITIONS = [
  { id:'p1', code:'ENG-SE-1', title:'Software Engineer',          level:'L3', dept:'Engineering', template:'Engineering · Software Engineer · v3', headcount:34 },
  { id:'p2', code:'ENG-SR-1', title:'Senior Software Engineer',   level:'L4', dept:'Engineering', template:'Engineering · Senior SWE · v2',         headcount:18 },
  { id:'p3', code:'ENG-EM-1', title:'Engineering Manager',        level:'M1', dept:'Engineering', template:'Engineering · Eng Manager · v2',        headcount:6  },
  { id:'p4', code:'PRD-PM-1', title:'Product Manager',            level:'M1', dept:'Product',     template:'Product · PM · v3',                     headcount:9  },
  { id:'p5', code:'DES-PD-1', title:'Product Designer',           level:'L3', dept:'Design',      template:'Design · Product Designer · v2',       headcount:11 },
  { id:'p6', code:'MKT-GM-1', title:'Growth Marketer',            level:'L3', dept:'Marketing',   template:'Marketing · Growth · v1',               headcount:8  },
  { id:'p7', code:'CS-AS-1',  title:'Customer Success Associate', level:'L2', dept:'Customer Care', template:'Customer Care · Associate · v2',     headcount:14 },
  { id:'p8', code:'FIN-AC-1', title:'Accountant',                 level:'L3', dept:'Finance',     template:'Finance · Accountant · v1',             headcount:6  },
];

const EMPLOYEES = [
  { id:'e1',  nip:'EMP-2021-0341', name:'Aqmal Hidayat',     initials:'AH', position:'Software Engineer',         dept:'Engineering',   division:'Technology', manager:'Rifky Oktaviano',  status:'active',  joined:'Aug 2021' },
  { id:'e2',  nip:'EMP-2020-0218', name:'Rifky Oktaviano',   initials:'RO', position:'Senior Software Engineer',  dept:'Engineering',   division:'Technology', manager:'Dewi Larasati',    status:'active',  joined:'Jan 2020' },
  { id:'e3',  nip:'EMP-2018-0042', name:'Dewi Larasati',     initials:'DL', position:'Engineering Manager',       dept:'Engineering',   division:'Technology', manager:'Bastian Aritonang',status:'active',  joined:'May 2018' },
  { id:'e4',  nip:'EMP-2022-0512', name:'Kirana Andini',     initials:'KA', position:'Product Designer',          dept:'Design',        division:'Technology', manager:'Naomi Salim',      status:'active',  joined:'Mar 2022' },
  { id:'e5',  nip:'EMP-2023-0701', name:'Reno Saputra',      initials:'RS', position:'Software Engineer',         dept:'Engineering',   division:'Technology', manager:'Rifky Oktaviano',  status:'active',  joined:'Feb 2023' },
  { id:'e6',  nip:'EMP-2019-0188', name:'Hendra Wijoyo',     initials:'HW', position:'Product Manager',           dept:'Product',       division:'Technology', manager:'Bastian Aritonang',status:'active',  joined:'Jul 2019' },
  { id:'e7',  nip:'EMP-2024-0903', name:'Mira Lestari',      initials:'ML', position:'Accountant',                dept:'Finance',       division:'Corporate',  manager:'Maya Setyowati',   status:'probation', joined:'Nov 2024' },
  { id:'e8',  nip:'EMP-2022-0420', name:'Bagas Widodo',      initials:'BW', position:'Customer Success Associate',dept:'Customer Care', division:'Business',   manager:'Aulia Hapsari',    status:'active',  joined:'Jun 2022' },
  { id:'e9',  nip:'EMP-2023-0815', name:'Citra Pertiwi',     initials:'CP', position:'Growth Marketer',           dept:'Marketing',     division:'Business',   manager:'Tania Kurniawan',  status:'active',  joined:'Sep 2023' },
  { id:'e10', nip:'EMP-2025-1102', name:'Yoga Pradana',      initials:'YP', position:'Software Engineer',         dept:'Engineering',   division:'Technology', manager:'Rifky Oktaviano',  status:'onboarding', joined:'Jan 2026' },
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
  const w = size === 'lg' ? 'max-w-3xl' : size === 'sm' ? 'max-w-md' : 'max-w-2xl';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${w} max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900`}>
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.x}</button>
        </div>
        <div className="max-h-[64vh] overflow-y-auto px-6 py-5">{children}</div>
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

function EmployeeModal({ open, onClose, onSave, initial }) {
  const blank = {
    nip:'', name:'', position:'Software Engineer', dept:'Engineering',
    division:'Technology', manager:'', status:'active', joined:'',
    email:'', phone:'',
  };
  const [form, setForm] = React.useState(initial || blank);
  React.useEffect(() => { setForm(initial || blank); }, [initial, open]);
  if (!open) return null;
  const update = (p) => setForm(f => ({ ...f, ...p }));
  const valid = form.nip.trim() && form.name.trim() && form.position && form.dept;

  const deptToDiv = Object.fromEntries(DEPARTMENTS.map(d => [d.name, d.division]));
  const onDeptChange = (v) => update({ dept:v, division: deptToDiv[v] || form.division });
  const managers = EMPLOYEES.filter(e => e.dept === form.dept).map(e => e.name);

  return (
    <Modal open={open} onClose={onClose} size="lg"
      title={initial ? `Edit employee · ${initial.name}` : 'Add employee'}
      subtitle={initial ? `NIP ${initial.nip} · ${initial.position}` : 'Create a new HRIS employee record'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button onClick={()=>{ onSave(form); onClose(); }} disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Add employee'}
          </button>
        </>
      }>
      <div className="grid grid-cols-2 gap-4">
        <Field label="NIP / Employee ID" required hint="e.g. EMP-2026-1042">
          <input value={form.nip} onChange={e=>update({ nip:e.target.value.toUpperCase() })} className={inputCls + ' tabular-nums'} />
        </Field>
        <Field label="Full name" required>
          <input value={form.name} onChange={e=>update({ name:e.target.value })} placeholder="Aqmal Pratama" className={inputCls} />
        </Field>
        <Field label="Work email">
          <input type="email" value={form.email} onChange={e=>update({ email:e.target.value })} placeholder="aqmal@company.id" className={inputCls} />
        </Field>
        <Field label="Phone">
          <input value={form.phone} onChange={e=>update({ phone:e.target.value })} placeholder="+62…" className={inputCls + ' tabular-nums'} />
        </Field>
        <Field label="Position" required>
          <select value={form.position} onChange={e=>update({ position:e.target.value })} className={inputCls}>
            {POSITIONS.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
          </select>
        </Field>
        <Field label="Department" required hint="Division updates automatically">
          <select value={form.dept} onChange={e=>onDeptChange(e.target.value)} className={inputCls}>
            {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </Field>
        <Field label="Division">
          <input value={form.division} disabled className={inputCls + ' bg-gray-50 text-gray-500 dark:bg-white/[0.02]'} />
        </Field>
        <Field label="Reports to (manager)">
          <select value={form.manager} onChange={e=>update({ manager:e.target.value })} className={inputCls}>
            <option value="">— Select manager —</option>
            {managers.filter(m => m !== form.name).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Employment status">
          <select value={form.status} onChange={e=>update({ status:e.target.value })} className={inputCls}>
            <option value="active">Active</option>
            <option value="probation">Probation</option>
            <option value="onboarding">Onboarding</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
        <Field label="Joined" hint="e.g. Jan 2026">
          <input value={form.joined} onChange={e=>update({ joined:e.target.value })} placeholder="Jan 2026" className={inputCls} />
        </Field>
        <div className="col-span-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
          New employees are auto-assigned the active KRA template for their position when the next cycle starts.
        </div>
      </div>
    </Modal>
  );
}

function DivisionModal({ open, onClose, onSave, initial }) {
  const blank = { name:'', head:'', headcount:0, departments:[] };
  const [form, setForm] = React.useState(initial || blank);
  const [deptInput, setDeptInput] = React.useState('');
  React.useEffect(() => { setForm(initial || blank); setDeptInput(''); }, [initial, open]);
  if (!open) return null;
  const update = (p) => setForm(f => ({ ...f, ...p }));
  const valid = form.name.trim() && form.head.trim();
  const addDept = () => {
    const v = deptInput.trim();
    if (!v || form.departments.includes(v)) return;
    update({ departments:[...form.departments, v] });
    setDeptInput('');
  };
  return (
    <Modal open={open} onClose={onClose} size="md"
      title={initial ? `Edit division · ${initial.name}` : 'Add division'}
      subtitle={initial ? `${initial.headcount} employees` : 'Create a new top-level org unit'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button onClick={()=>{ onSave(form); onClose(); }} disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Add division'}
          </button>
        </>
      }>
      <div className="space-y-4">
        <Field label="Division name" required>
          <input value={form.name} onChange={e=>update({ name:e.target.value })} placeholder="Technology" className={inputCls} />
        </Field>
        <Field label="Head of Division" required>
          <input value={form.head} onChange={e=>update({ head:e.target.value })} placeholder="Bastian Aritonang" className={inputCls} />
        </Field>
        <Field label="Headcount" hint="Computed from employees · adjust manually if seeding">
          <input type="number" min="0" value={form.headcount} onChange={e=>update({ headcount: parseInt(e.target.value||0,10) })} className={inputCls + ' tabular-nums'} />
        </Field>
        <Field label="Departments" hint="Press Enter to add">
          <div className="flex gap-2">
            <input value={deptInput} onChange={e=>setDeptInput(e.target.value)}
              onKeyDown={e=>{ if (e.key === 'Enter') { e.preventDefault(); addDept(); } }}
              placeholder="Engineering" className={inputCls} />
            <button type="button" onClick={addDept} className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Add</button>
          </div>
          {form.departments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.departments.map(d => (
                <span key={d} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {d}
                  <button onClick={()=>update({ departments: form.departments.filter(x=>x!==d) })} className="text-gray-400 hover:text-error-500">×</button>
                </span>
              ))}
            </div>
          )}
        </Field>
      </div>
    </Modal>
  );
}

function DepartmentModal({ open, onClose, onSave, initial }) {
  const blank = { name:'', division:'Technology', hod:'', positions:0, headcount:0 };
  const [form, setForm] = React.useState(initial || blank);
  React.useEffect(() => { setForm(initial || blank); }, [initial, open]);
  if (!open) return null;
  const update = (p) => setForm(f => ({ ...f, ...p }));
  const valid = form.name.trim() && form.hod.trim() && form.division;
  return (
    <Modal open={open} onClose={onClose} size="md"
      title={initial ? `Edit department · ${initial.name}` : 'Add department'}
      subtitle={initial ? `${initial.headcount} employees · ${initial.positions} positions` : 'Create a new department under a division'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button onClick={()=>{ onSave(form); onClose(); }} disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Add department'}
          </button>
        </>
      }>
      <div className="space-y-4">
        <Field label="Department name" required>
          <input value={form.name} onChange={e=>update({ name:e.target.value })} placeholder="Engineering" className={inputCls} />
        </Field>
        <Field label="Division" required>
          <select value={form.division} onChange={e=>update({ division:e.target.value })} className={inputCls}>
            {DIVISIONS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </Field>
        <Field label="Head of Department" required>
          <input value={form.hod} onChange={e=>update({ hod:e.target.value })} placeholder="Dewi Larasati" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Positions">
            <input type="number" min="0" value={form.positions} onChange={e=>update({ positions: parseInt(e.target.value||0,10) })} className={inputCls + ' tabular-nums'} />
          </Field>
          <Field label="Headcount">
            <input type="number" min="0" value={form.headcount} onChange={e=>update({ headcount: parseInt(e.target.value||0,10) })} className={inputCls + ' tabular-nums'} />
          </Field>
        </div>
      </div>
    </Modal>
  );
}

function PositionModal({ open, onClose, onSave, initial }) {
  const blank = { code:'', title:'', level:'L3', dept:'Engineering', template:'', headcount:0 };
  const [form, setForm] = React.useState(initial || blank);
  React.useEffect(() => { setForm(initial || blank); }, [initial, open]);
  if (!open) return null;
  const update = (p) => setForm(f => ({ ...f, ...p }));
  const valid = form.code.trim() && form.title.trim() && form.dept;
  return (
    <Modal open={open} onClose={onClose} size="md"
      title={initial ? `Edit position · ${initial.title}` : 'Add position'}
      subtitle={initial ? `${initial.code} · ${initial.headcount} filled` : 'Create a new role within a department'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button onClick={()=>{ onSave(form); onClose(); }} disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Add position'}
          </button>
        </>
      }>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Code" required hint="e.g. ENG-SE-1">
            <input value={form.code} onChange={e=>update({ code:e.target.value.toUpperCase() })} className={inputCls + ' tabular-nums'} />
          </Field>
          <div className="col-span-2">
            <Field label="Position title" required>
              <input value={form.title} onChange={e=>update({ title:e.target.value })} placeholder="Software Engineer" className={inputCls} />
            </Field>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Level">
            <select value={form.level} onChange={e=>update({ level:e.target.value })} className={inputCls}>
              {['L1','L2','L3','L4','L5','M1','M2','M3'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Department" required>
            <select value={form.dept} onChange={e=>update({ dept:e.target.value })} className={inputCls}>
              {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label="KRA template" hint="Free-text reference · link properly in KRA Templates page">
          <input value={form.template} onChange={e=>update({ template:e.target.value })} placeholder="Engineering · Software Engineer · v3" className={inputCls} />
        </Field>
        <Field label="Filled headcount">
          <input type="number" min="0" value={form.headcount} onChange={e=>update({ headcount: parseInt(e.target.value||0,10) })} className={inputCls + ' tabular-nums'} />
        </Field>
      </div>
    </Modal>
  );
}

function InfoTip({ children, label }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="relative inline-flex items-center gap-1"
      onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}
      onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)}>
      {children}
      <button tabIndex={0} aria-label={label}
        className="grid h-3.5 w-3.5 place-items-center rounded-full bg-gray-200 text-[9px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">i</button>
      {open && (
        <span role="tooltip" className="absolute left-1/2 top-full z-20 mt-1.5 w-56 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-[11px] font-normal leading-snug text-white shadow-lg dark:bg-gray-700">
          {label}
        </span>
      )}
    </span>
  );
}

function Tabs({ value, onChange, items }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/[0.02]">
      {items.map(it => (
        <button key={it.id} onClick={() => onChange(it.id)}
          className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
            value === it.id
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}>
          {it.label}
          <span className={`ml-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
            value === it.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
          }`}>{it.count}</span>
        </button>
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    active:     { label:'Active',     tone:'success' },
    probation:  { label:'Probation',  tone:'warning' },
    onboarding: { label:'Onboarding', tone:'info'    },
    inactive:   { label:'Inactive',   tone:'gray'    },
  };
  const m = map[status] || map.active;
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

function Toolbar({ search, onSearch, onAdd, addLabel }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icon.search}</span>
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search…"
            className="h-10 w-72 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200" />
        </div>
        <button className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300">
          {Icon.filter}<span>Filter</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300">
          {Icon.download}<span>Export CSV</span>
        </button>
        <button onClick={onAdd} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
          {Icon.plus}<span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}

// ── Tab views ──
function DivisionsView({ search, divisions, onEdit, onDelete }) {
  const rows = divisions.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.head.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-2">
      {rows.map(d => (
        <div key={d.id} className="group rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                {Icon.building}
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{d.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Head of Division · {d.head}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={()=>onEdit(d)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
              <button onClick={()=>{ if (confirm(`Delete division ${d.name}?`)) onDelete(d.id); }} className="rounded-lg p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10">{Icon.trash}</button>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Headcount</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{d.headcount}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Departments</p>
              <p className="mt-0.5 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{d.departments.length}</p>
            </div>
            <div>
              <InfoTip label="Status of the current appraisal cycle for this division — whether self-appraisals, reviews, and calibration are still active or already closed.">
                <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Cycle status</p>
              </InfoTip>
              <p className="mt-0.5 text-sm font-semibold text-success-600 dark:text-success-400">In progress</p>
              <p className="mt-0.5 text-[10px] text-gray-400">Q1 2026 · self-appraisal phase</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {d.departments.map(name => (
              <span key={name} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">{name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DepartmentsView({ search, departments, onEdit, onDelete }) {
  const rows = departments.filter(d => (d.name+d.division+d.hod).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="px-6 py-3">Department</th>
            <th className="px-3 py-3">Division</th>
            <th className="px-3 py-3">Head of Department</th>
            <th className="px-3 py-3 text-right">Positions</th>
            <th className="px-3 py-3 text-right">Headcount</th>
            <th className="px-6 py-3 w-12" />
          </tr>
        </thead>
        <tbody>
          {rows.map(d => (
            <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {Icon.layers}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">{d.name}</p>
                </div>
              </td>
              <td className="px-3 py-4 text-gray-600 dark:text-gray-300">{d.division}</td>
              <td className="px-3 py-4">
                <div className="flex items-center gap-2">
                  <Avatar initials={d.hod.split(' ').map(s=>s[0]).slice(0,2).join('')} size="sm" tone="brand" />
                  <span className="text-gray-700 dark:text-gray-200">{d.hod}</span>
                </div>
              </td>
              <td className="px-3 py-4 text-right tabular-nums text-gray-700 dark:text-gray-200">{d.positions}</td>
              <td className="px-3 py-4 text-right tabular-nums">
                <span className="font-semibold text-gray-900 dark:text-white">{d.headcount}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-1">
                  <button onClick={()=>onEdit(d)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
                  <button onClick={()=>{ if (confirm(`Delete department ${d.name}?`)) onDelete(d.id); }} className="rounded p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10">{Icon.trash}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PositionsView({ search, positions, onEdit, onDelete }) {
  const rows = positions.filter(p => (p.title+p.code+p.dept+p.template).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="px-6 py-3">Position</th>
            <th className="px-3 py-3">Code</th>
            <th className="px-3 py-3">Level</th>
            <th className="px-3 py-3">Department</th>
            <th className="px-3 py-3">KRA template</th>
            <th className="px-3 py-3 text-right">Filled</th>
            <th className="px-6 py-3 w-12" />
          </tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]">
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{p.title}</td>
              <td className="px-3 py-4">
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">{p.code}</code>
              </td>
              <td className="px-3 py-4">
                <Badge tone={p.level.startsWith('M') ? 'brand' : 'gray'}>{p.level}</Badge>
              </td>
              <td className="px-3 py-4 text-gray-600 dark:text-gray-300">{p.dept}</td>
              <td className="px-3 py-4">
                <a href="KRA Templates.html" className="inline-flex items-center gap-1.5 text-brand-600 hover:underline dark:text-brand-300">
                  {Icon.layers}<span className="text-xs">{p.template}</span>
                </a>
              </td>
              <td className="px-3 py-4 text-right tabular-nums">
                <span className="font-semibold text-gray-900 dark:text-white">{p.headcount}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-1">
                  <button onClick={()=>onEdit(p)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
                  <button onClick={()=>{ if (confirm(`Delete position ${p.title} (${p.code})?`)) onDelete(p.id); }} className="rounded p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10">{Icon.trash}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmployeesView({ search, employees, onEdit, onDelete }) {
  const rows = employees.filter(e => (e.name+e.nip+e.position+e.dept+e.manager).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="px-6 py-3">Employee</th>
            <th className="px-3 py-3">NIP</th>
            <th className="px-3 py-3">Position</th>
            <th className="px-3 py-3">Department</th>
            <th className="px-3 py-3">Reports to</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Joined</th>
            <th className="px-6 py-3 w-12" />
          </tr>
        </thead>
        <tbody>
          {rows.map(e => (
            <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar initials={e.initials} size="md" tone="brand" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{e.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{e.division}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4">
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">{e.nip}</code>
              </td>
              <td className="px-3 py-4 text-gray-700 dark:text-gray-200">{e.position}</td>
              <td className="px-3 py-4 text-gray-600 dark:text-gray-300">{e.dept}</td>
              <td className="px-3 py-4 text-gray-600 dark:text-gray-300">{e.manager}</td>
              <td className="px-3 py-4"><StatusPill status={e.status} /></td>
              <td className="px-3 py-4 tabular-nums text-gray-500 dark:text-gray-400">{e.joined}</td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-1">
                  <button onClick={()=>onEdit(e)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
                  <button onClick={()=>{ if (confirm(`Remove ${e.name} (${e.nip})?`)) onDelete(e.id); }} className="rounded p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10">{Icon.trash}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState('employees');
  const [search, setSearch] = useState('');

  const [divisions,   setDivisions]   = useState(DIVISIONS);
  const [departments, setDepartments] = useState(DEPARTMENTS);
  const [positions,   setPositions]   = useState(POSITIONS);
  const [employees,   setEmployees]   = useState(EMPLOYEES);

  const [editingDiv, setEditingDiv] = useState(null);
  const [addingDiv,  setAddingDiv]  = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [addingDept,  setAddingDept]  = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [addingPos,  setAddingPos]  = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [addingEmp,  setAddingEmp]  = useState(false);

  const tabs = [
    { id:'divisions',   label:'Divisions',   count: divisions.length },
    { id:'departments', label:'Departments', count: departments.length },
    { id:'positions',   label:'Positions',   count: positions.length },
    { id:'employees',   label:'Employees',   count: employees.length },
  ];
  const addLabel = {
    divisions:'Add division', departments:'Add department', positions:'Add position', employees:'Add employee'
  }[tab];

  const onAdd = () => {
    if (tab === 'divisions')   setAddingDiv(true);
    if (tab === 'departments') setAddingDept(true);
    if (tab === 'positions')   setAddingPos(true);
    if (tab === 'employees')   setAddingEmp(true);
  };

  const upsertDivision = (form) => setDivisions(prev =>
    editingDiv ? prev.map(d => d.id === editingDiv.id ? { ...d, ...form } : d)
               : [...prev, { ...form, id:`div${Date.now()}` }]);
  const deleteDivision = (id) => setDivisions(prev => prev.filter(d => d.id !== id));

  const upsertDepartment = (form) => setDepartments(prev =>
    editingDept ? prev.map(d => d.id === editingDept.id ? { ...d, ...form } : d)
                : [...prev, { ...form, id:`dept${Date.now()}` }]);
  const deleteDepartment = (id) => setDepartments(prev => prev.filter(d => d.id !== id));

  const upsertPosition = (form) => setPositions(prev =>
    editingPos ? prev.map(p => p.id === editingPos.id ? { ...p, ...form } : p)
               : [...prev, { ...form, id:`pos${Date.now()}` }]);
  const deletePosition = (id) => setPositions(prev => prev.filter(p => p.id !== id));

  const upsertEmployee = (form) => {
    setEmployees(prev => {
      if (editingEmp) return prev.map(e => e.id === editingEmp.id ? { ...e, ...form } : e);
      const initials = form.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
      return [...prev, { ...form, id: `e${Date.now()}`, initials }];
    });
  };
  const deleteEmployee = (id) => setEmployees(prev => prev.filter(e => e.id !== id));

  return (
    <PageShell active="organization" user={HR_USER} brandHue="indigo">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Master data</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Organization</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Source of truth for divisions, departments, positions, and employees. Changes take effect on the next cycle.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success-500"/>Synced with HRIS · 2 min ago</span>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label:'Divisions',    value: divisions.length,   icon: Icon.building },
          { label:'Departments',  value: departments.length, icon: Icon.layers   },
          { label:'Positions',    value: positions.length,   icon: Icon.paper    },
          { label:'Employees',    value: employees.length,   icon: Icon.team     },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">{s.label}</span>
              <span className="text-gray-300 dark:text-gray-600">{s.icon}</span>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} items={tabs} />
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
        <Toolbar search={search} onSearch={setSearch} addLabel={addLabel} onAdd={onAdd} />
        {tab === 'divisions'   && <DivisionsView   search={search} divisions={divisions}     onEdit={setEditingDiv}  onDelete={deleteDivision}   />}
        {tab === 'departments' && <DepartmentsView search={search} departments={departments} onEdit={setEditingDept} onDelete={deleteDepartment} />}
        {tab === 'positions'   && <PositionsView   search={search} positions={positions}     onEdit={setEditingPos}  onDelete={deletePosition}   />}
        {tab === 'employees'   && <EmployeesView   search={search} employees={employees}     onEdit={setEditingEmp}  onDelete={deleteEmployee}   />}

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <span>Showing all entries</span>
          <div className="flex items-center gap-1">
            <button className="rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.05]">Prev</button>
            <button className="rounded-md border border-brand-500 bg-brand-50 px-2 py-1 font-semibold text-brand-700 dark:border-brand-500 dark:bg-brand-500/10 dark:text-brand-300">1</button>
            <button className="rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.05]">Next</button>
          </div>
        </div>
      </div>

      <DivisionModal   open={addingDiv}     onClose={()=>setAddingDiv(false)}   onSave={upsertDivision}   initial={null} />
      <DivisionModal   open={!!editingDiv}  onClose={()=>setEditingDiv(null)}   onSave={upsertDivision}   initial={editingDiv} />
      <DepartmentModal open={addingDept}    onClose={()=>setAddingDept(false)}  onSave={upsertDepartment} initial={null} />
      <DepartmentModal open={!!editingDept} onClose={()=>setEditingDept(null)}  onSave={upsertDepartment} initial={editingDept} />
      <PositionModal   open={addingPos}     onClose={()=>setAddingPos(false)}   onSave={upsertPosition}   initial={null} />
      <PositionModal   open={!!editingPos}  onClose={()=>setEditingPos(null)}   onSave={upsertPosition}   initial={editingPos} />
      <EmployeeModal   open={addingEmp}     onClose={()=>setAddingEmp(false)}   onSave={upsertEmployee}   initial={null} />
      <EmployeeModal   open={!!editingEmp}  onClose={()=>setEditingEmp(null)}   onSave={upsertEmployee}   initial={editingEmp} />
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
