import { useState } from 'react'
import { useOrgStore } from '../hooks/use-org'
import { PageShell } from '@shared/layouts/page-shell'
import { Badge } from '@shared/layouts/sidebar-badge'
import { Avatar } from '@shared/layouts/avatar'
import { Modal } from '@shared/ui/modal'
import { Icon } from '@shared/layouts/icon'
import type { Division, Department, Position, Employee } from '../data/mock-org'

const inp = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90'

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-gray-400">{hint}</span>}
    </label>
  )
}

function StatusPill({ status }: { status: Employee['status'] }) {
  const map: Record<string, { label: string; tone: 'success' | 'warning' | 'info' | 'gray' }> = {
    active:     { label: 'Active',     tone: 'success' },
    probation:  { label: 'Probation',  tone: 'warning' },
    onboarding: { label: 'Onboarding', tone: 'info'    },
    inactive:   { label: 'Inactive',   tone: 'gray'    },
  }
  const m = map[status] ?? map.active
  return <Badge tone={m.tone}>{m.label}</Badge>
}

function Toolbar({ search, onSearch, addLabel, onAdd }: { search: string; onSearch: (v: string) => void; addLabel: string; onAdd: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icon.search}</span>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search…"
          className="h-10 w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        />
      </div>
      <button
        onClick={onAdd}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 active:bg-brand-700"
      >
        {Icon.plus}
        <span>{addLabel}</span>
      </button>
    </div>
  )
}

function DivisionModal({ open, onClose, onSave, initial }: {
  open: boolean; onClose: () => void
  onSave: (form: Omit<Division, 'id'>, id?: string) => void
  initial?: Division | null
}) {
  const blank: Omit<Division, 'id'> = { name: '', head: '', headId: '', headcount: 0, departments: [] }
  const [form, setForm] = useState<Omit<Division, 'id'>>(
    initial
      ? { name: initial.name, head: initial.head, headId: initial.headId, headcount: initial.headcount, departments: [...initial.departments] }
      : blank
  )
  const update = (p: Partial<typeof form>) => setForm(f => ({ ...f, ...p }))
  return (
    <Modal open={open} onClose={onClose} title={initial ? `Edit division · ${initial.name}` : 'Add division'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button disabled={!form.name.trim() || !form.head.trim()} onClick={() => { onSave(form, initial?.id); onClose() }}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Add division'}
          </button>
        </>
      }>
      <div className="space-y-4">
        <Field label="Division name" required><input value={form.name} onChange={e => update({ name: e.target.value })} placeholder="Technology" className={inp} /></Field>
        <Field label="Head of Division" required><input value={form.head} onChange={e => update({ head: e.target.value })} placeholder="Name" className={inp} /></Field>
      </div>
    </Modal>
  )
}

function DepartmentModal({ open, onClose, onSave, initial, divisionNames }: {
  open: boolean; onClose: () => void
  onSave: (form: Omit<Department, 'id'>, id?: string) => void
  initial?: Department | null
  divisionNames: string[]
}) {
  const blank: Omit<Department, 'id'> = { name: '', division: divisionNames[0] ?? '', divId: '', headId: '', hod: '', positions: 0, headcount: 0 }
  const [form, setForm] = useState<Omit<Department, 'id'>>(
    initial ? { name: initial.name, division: initial.division, divId: initial.divId, headId: initial.headId, hod: initial.hod, positions: initial.positions, headcount: initial.headcount } : blank
  )
  const update = (p: Partial<typeof form>) => setForm(f => ({ ...f, ...p }))
  return (
    <Modal open={open} onClose={onClose} title={initial ? `Edit department · ${initial.name}` : 'Add department'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button disabled={!form.name.trim() || !form.hod.trim()} onClick={() => { onSave(form, initial?.id); onClose() }}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Add department'}
          </button>
        </>
      }>
      <div className="space-y-4">
        <Field label="Department name" required><input value={form.name} onChange={e => update({ name: e.target.value })} placeholder="Engineering" className={inp} /></Field>
        <Field label="Division" required>
          <select value={form.division} onChange={e => update({ division: e.target.value })} className={inp}>
            {divisionNames.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Head of Department" required><input value={form.hod} onChange={e => update({ hod: e.target.value })} placeholder="Name" className={inp} /></Field>
      </div>
    </Modal>
  )
}


function PositionModal({ open, onClose, onSave, initial, deptNames }: {
  open: boolean; onClose: () => void
  onSave: (form: Omit<Position, 'id'>, id?: string) => void
  initial?: Position | null
  deptNames: string[]
}) {
  const blank: Omit<Position, 'id'> = { code: '', title: '', level: 'IC2', dept: deptNames[0] ?? '', template: '', headcount: 0 }
  const [form, setForm] = useState<Omit<Position, 'id'>>(
    initial ? { code: initial.code, title: initial.title, level: initial.level, dept: initial.dept, template: initial.template, headcount: initial.headcount } : blank
  )
  const update = (p: Partial<typeof form>) => setForm(f => ({ ...f, ...p }))
  return (
    <Modal open={open} onClose={onClose} title={initial ? `Edit position · ${initial.title}` : 'Add position'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button disabled={!form.code.trim() || !form.title.trim()} onClick={() => { onSave(form, initial?.id); onClose() }}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Add position'}
          </button>
        </>
      }>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Code" required hint="e.g. ENG-SE-1">
            <input value={form.code} onChange={e => update({ code: e.target.value.toUpperCase() })} className={inp + ' tabular-nums'} />
          </Field>
          <div className="col-span-2">
            <Field label="Position title" required>
              <input value={form.title} onChange={e => update({ title: e.target.value })} placeholder="Software Engineer" className={inp} />
            </Field>
          </div>
        </div>
        <Field label="Department" required>
          <select value={form.dept} onChange={e => update({ dept: e.target.value })} className={inp}>
            {deptNames.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="KRA template" hint="Reference to KRA Templates page">
          <input value={form.template} onChange={e => update({ template: e.target.value })} placeholder="Engineering · Software Engineer · v3" className={inp} />
        </Field>
      </div>
    </Modal>
  )
}

const DEPT_DIV: Record<string, string> = {
  Engineering: 'Technology', Product: 'Technology', Design: 'Technology', QA: 'Technology',
  Marketing: 'Business', Sales: 'Business', 'Customer Care': 'Business',
  Logistics: 'Operations', Procurement: 'Operations',
  Finance: 'Corporate', 'People (HR)': 'Corporate', Legal: 'Corporate',
}

function EmployeeModal({ open, onClose, onSave, initial, deptNames, employees }: {
  open: boolean; onClose: () => void
  onSave: (form: Omit<Employee, 'id' | 'initials'>, id?: string) => void
  initial?: Employee | null
  deptNames: string[]
  employees: Employee[]
}) {
  const blank: Omit<Employee, 'id' | 'initials'> = {
    nip: '', name: '', email: '', position: '', dept: deptNames[0] ?? '',
    div: 'Technology', division: 'Technology', manager: '', squad: null,
    grade: 'IC2', status: 'active', joined: '',
  }
  const [form, setForm] = useState<Omit<Employee, 'id' | 'initials'>>(
    initial
      ? { nip: initial.nip, name: initial.name, email: initial.email, position: initial.position, dept: initial.dept, div: initial.div, division: initial.division, manager: initial.manager, squad: initial.squad, grade: initial.grade, status: initial.status, joined: initial.joined }
      : blank
  )
  const update = (p: Partial<typeof form>) => setForm(f => ({ ...f, ...p }))
  const onDeptChange = (v: string) => { const div = DEPT_DIV[v] ?? form.division; update({ dept: v, div, division: div }) }
  const managers = employees.filter(e => e.dept === form.dept && e.name !== form.name).map(e => e.name)
  const valid = form.nip.trim() && form.name.trim() && form.position.trim() && form.dept
  return (
    <Modal open={open} onClose={onClose} title={initial ? `Edit · ${initial.name}` : 'Add employee'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Cancel</button>
          <button disabled={!valid} onClick={() => { onSave(form, initial?.id); onClose() }}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Save changes' : 'Add employee'}
          </button>
        </>
      }>
      <div className="grid grid-cols-2 gap-4">
        <Field label="NIP / Employee ID" required hint="e.g. EMP-2026-1042">
          <input value={form.nip} onChange={e => update({ nip: e.target.value.toUpperCase() })} className={inp + ' tabular-nums'} />
        </Field>
        <Field label="Full name" required>
          <input value={form.name} onChange={e => update({ name: e.target.value })} placeholder="Full name" className={inp} />
        </Field>
        <Field label="Work email">
          <input type="email" value={form.email} onChange={e => update({ email: e.target.value })} placeholder="name@company.id" className={inp} />
        </Field>
        <Field label="Position" required>
          <input value={form.position} onChange={e => update({ position: e.target.value })} placeholder="Software Engineer" className={inp} />
        </Field>
        <Field label="Department" required hint="Division updates automatically">
          <select value={form.dept} onChange={e => onDeptChange(e.target.value)} className={inp}>
            {deptNames.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Division">
          <input value={form.division} disabled className={inp + ' cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-white/[0.02]'} />
        </Field>
        <Field label="Reports to">
          <select value={form.manager ?? ''} onChange={e => update({ manager: e.target.value })} className={inp}>
            <option value="">— Select manager —</option>
            {managers.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Grade">
          <input value={form.grade} onChange={e => update({ grade: e.target.value.toUpperCase() })} placeholder="IC2" className={inp + ' tabular-nums'} />
        </Field>
        <Field label="Employment status">
          <select value={form.status} onChange={e => update({ status: e.target.value as Employee['status'] })} className={inp}>
            <option value="active">Active</option>
            <option value="probation">Probation</option>
            <option value="onboarding">Onboarding</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
        <Field label="Joined" hint="e.g. Jan 2026">
          <input value={form.joined} onChange={e => update({ joined: e.target.value })} placeholder="Jan 2026" className={inp} />
        </Field>
      </div>
    </Modal>
  )
}

function DivisionsView({ search, divisions, onEdit, onDelete }: { search: string; divisions: Division[]; onEdit: (d: Division) => void; onDelete: (id: string) => void }) {
  const rows = divisions.filter(d => (d.name + d.head).toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
      {rows.map(d => (
        <div key={d.id} className="group rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">{Icon.building}</div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{d.name}</p>
                <p className="text-xs text-gray-500">Head · {d.head}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => onEdit(d)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
              <button onClick={() => { if (confirm(`Delete division ${d.name}?`)) onDelete(d.id) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">{Icon.trash}</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400">Headcount</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900 dark:text-white">{d.headcount}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400">Departments</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900 dark:text-white">{d.departments.length}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {d.departments.map(name => (
              <span key={name} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">{name}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function DepartmentsView({ search, departments, onEdit, onDelete }: { search: string; departments: Department[]; onEdit: (d: Department) => void; onDelete: (id: string) => void }) {
  const rows = departments.filter(d => (d.name + d.division + d.hod).toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
            <th className="px-6 py-3">Department</th><th className="px-3 py-3">Division</th>
            <th className="px-3 py-3">Head of Department</th><th className="px-3 py-3 text-right">Positions</th>
            <th className="px-3 py-3 text-right">Headcount</th><th className="w-16 px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map(d => (
            <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]">
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800">{Icon.layers}</div>
                  <p className="font-semibold text-gray-900 dark:text-white">{d.name}</p>
                </div>
              </td>
              <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">{d.division}</td>
              <td className="px-3 py-3.5">
                <div className="flex items-center gap-2">
                  <Avatar initials={d.hod.split(' ').map(s => s[0]).slice(0, 2).join('')} size="sm" tone="brand" />
                  <span className="text-gray-700 dark:text-gray-200">{d.hod}</span>
                </div>
              </td>
              <td className="px-3 py-3.5 text-right tabular-nums text-gray-600 dark:text-gray-300">{d.positions}</td>
              <td className="px-3 py-3.5 text-right tabular-nums font-semibold text-gray-900 dark:text-white">{d.headcount}</td>
              <td className="px-6 py-3.5">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onEdit(d)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
                  <button onClick={() => { if (confirm(`Delete department ${d.name}?`)) onDelete(d.id) }} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">{Icon.trash}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PositionsView({ search, positions, onEdit, onDelete }: { search: string; positions: Position[]; onEdit: (p: Position) => void; onDelete: (id: string) => void }) {
  const rows = positions.filter(p => (p.title + p.code + p.dept).toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
            <th className="px-6 py-3">Position</th><th className="px-3 py-3">Code</th><th className="px-3 py-3">Level</th>
            <th className="px-3 py-3">Department</th><th className="px-3 py-3">KRA Template</th>
            <th className="px-3 py-3 text-right">Filled</th><th className="w-16 px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]">
              <td className="px-6 py-3.5 font-semibold text-gray-900 dark:text-white">{p.title}</td>
              <td className="px-3 py-3.5"><code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">{p.code}</code></td>
              <td className="px-3 py-3.5"><Badge tone={p.level.startsWith('M') ? 'brand' : 'gray'}>{p.level}</Badge></td>
              <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">{p.dept}</td>
              <td className="px-3 py-3.5 max-w-[200px] truncate text-xs text-gray-500 dark:text-gray-400">{p.template || '—'}</td>
              <td className="px-3 py-3.5 text-right tabular-nums font-semibold text-gray-900 dark:text-white">{p.headcount}</td>
              <td className="px-6 py-3.5">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onEdit(p)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
                  <button onClick={() => { if (confirm(`Delete position ${p.title}?`)) onDelete(p.id) }} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">{Icon.trash}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmployeesView({ search, employees, onEdit, onDelete }: { search: string; employees: Employee[]; onEdit: (e: Employee) => void; onDelete: (id: string) => void }) {
  const rows = employees.filter(e => (e.name + e.nip + e.position + e.dept + e.manager).toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
            <th className="px-6 py-3">Employee</th><th className="px-3 py-3">NIP</th><th className="px-3 py-3">Position</th>
            <th className="px-3 py-3">Department</th><th className="px-3 py-3">Reports to</th>
            <th className="px-3 py-3">Status</th><th className="px-3 py-3">Joined</th><th className="w-16 px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map(e => (
            <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]">
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar initials={e.initials} size="md" tone="brand" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{e.name}</p>
                    <p className="text-[11px] text-gray-400">{e.division}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3.5"><code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">{e.nip}</code></td>
              <td className="px-3 py-3.5 text-gray-700 dark:text-gray-200">{e.position}</td>
              <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">{e.dept}</td>
              <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">{e.manager || '—'}</td>
              <td className="px-3 py-3.5"><StatusPill status={e.status} /></td>
              <td className="px-3 py-3.5 tabular-nums text-gray-400">{e.joined}</td>
              <td className="px-6 py-3.5">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onEdit(e)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
                  <button onClick={() => { if (confirm(`Remove ${e.name}?`)) onDelete(e.id) }} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">{Icon.trash}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type TabId = 'divisions' | 'departments' | 'positions' | 'employees'

function TabStrip({ value, onChange, tabs }: { value: TabId; onChange: (v: TabId) => void; tabs: { id: TabId; label: string; count: number }[] }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/[0.02]">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
            value === t.id ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
          }`}>
          {t.label}
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            value === t.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
          }`}>{t.count}</span>
        </button>
      ))}
    </div>
  )
}

export function HrOrganizationPage() {
  const store = useOrgStore()
  const [tab, setTab] = useState<TabId>('employees')
  const [search, setSearch] = useState('')

  const [editingDiv,  setEditingDiv]  = useState<Division | null>(null)
  const [addingDiv,   setAddingDiv]   = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [addingDept,  setAddingDept]  = useState(false)
  const [editingPos,  setEditingPos]  = useState<Position | null>(null)
  const [addingPos,   setAddingPos]   = useState(false)
  const [editingEmp,  setEditingEmp]  = useState<Employee | null>(null)
  const [addingEmp,   setAddingEmp]   = useState(false)

  const tabData: { id: TabId; label: string; count: number }[] = [
    { id: 'divisions',   label: 'Divisions',   count: store.divisions.length   },
    { id: 'departments', label: 'Departments', count: store.departments.length },
    { id: 'positions',   label: 'Positions',   count: store.positions.length   },
    { id: 'employees',   label: 'Employees',   count: store.employees.length   },
  ]

  const addLabel = { divisions: 'Add division', departments: 'Add department', positions: 'Add position', employees: 'Add employee' }[tab]
  const onAdd = () => {
    if (tab === 'divisions')   setAddingDiv(true)
    if (tab === 'departments') setAddingDept(true)
    if (tab === 'positions')   setAddingPos(true)
    if (tab === 'employees')   setAddingEmp(true)
  }

  const divisionNames = store.divisions.map(d => d.name)
  const deptNames     = store.departments.map(d => d.name)

  return (
    <PageShell breadcrumb="Organization">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Master data</p>
            <h1 style={{ fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontWeight: 600, fontSize: '24px' }} className="mt-1 text-gray-900 dark:text-white">
              Organization
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Source of truth for divisions, departments, positions, and employees.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Synced · 2 min ago
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {([
            { label: 'Divisions',   value: store.divisions.length,   icon: Icon.building },
            { label: 'Departments', value: store.departments.length, icon: Icon.layers   },
            { label: 'Positions',   value: store.positions.length,   icon: Icon.paper    },
            { label: 'Employees',   value: store.employees.length,   icon: Icon.team     },
          ] as const).map(s => (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{s.label}</span>
                <span className="text-gray-300 dark:text-gray-700">{s.icon}</span>
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <TabStrip value={tab} onChange={v => { setTab(v); setSearch('') }} tabs={tabData} />

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
          <Toolbar search={search} onSearch={setSearch} addLabel={addLabel} onAdd={onAdd} />
          {tab === 'divisions'   && <DivisionsView   search={search} divisions={store.divisions}     onEdit={setEditingDiv}  onDelete={store.deleteDivision}   />}
          {tab === 'departments' && <DepartmentsView search={search} departments={store.departments} onEdit={setEditingDept} onDelete={store.deleteDepartment} />}
          {tab === 'positions'   && <PositionsView   search={search} positions={store.positions}     onEdit={setEditingPos}  onDelete={store.deletePosition}   />}
          {tab === 'employees'   && <EmployeesView   search={search} employees={store.employees}     onEdit={setEditingEmp}  onDelete={store.deleteEmployee}   />}
          <div className="border-t border-gray-100 px-6 py-3 text-xs text-gray-400 dark:border-gray-800">
            {store.divisions.length} div · {store.departments.length} dept · {store.positions.length} pos · {store.employees.length} emp
          </div>
        </div>
      </div>

      <DivisionModal   open={addingDiv}     onClose={() => setAddingDiv(false)}   onSave={f => store.upsertDivision(f)}         initial={null} />
      <DivisionModal   open={!!editingDiv}  onClose={() => setEditingDiv(null)}   onSave={(f, id) => store.upsertDivision(f, id)}   initial={editingDiv} />
      <DepartmentModal open={addingDept}    onClose={() => setAddingDept(false)}  onSave={f => store.upsertDepartment(f)}       initial={null}       divisionNames={divisionNames} />
      <DepartmentModal open={!!editingDept} onClose={() => setEditingDept(null)}  onSave={(f, id) => store.upsertDepartment(f, id)} initial={editingDept} divisionNames={divisionNames} />
      <PositionModal   open={addingPos}     onClose={() => setAddingPos(false)}   onSave={f => store.upsertPosition(f)}         initial={null}       deptNames={deptNames} />
      <PositionModal   open={!!editingPos}  onClose={() => setEditingPos(null)}   onSave={(f, id) => store.upsertPosition(f, id)}   initial={editingPos} deptNames={deptNames} />
      <EmployeeModal   open={addingEmp}     onClose={() => setAddingEmp(false)}   onSave={f => store.upsertEmployee(f)}         initial={null}       deptNames={deptNames} employees={store.employees} />
      <EmployeeModal   open={!!editingEmp}  onClose={() => setEditingEmp(null)}   onSave={(f, id) => store.upsertEmployee(f, id)}   initial={editingEmp} deptNames={deptNames} employees={store.employees} />
    </PageShell>
  )
}
