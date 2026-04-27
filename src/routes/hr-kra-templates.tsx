import { useState, useMemo } from 'react'
import { PageShell } from '@shared/layouts/page-shell'
import { Badge } from '@shared/layouts/sidebar-badge'
import { Icon } from '@shared/layouts/icon'
import { KRA_TEMPLATES, KraTemplateV2, KraItem, TemplateStatus } from '../data/mock-kras'

const inputCls = 'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90'

const DEPTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Customer Care', 'Finance', 'People (HR)', 'Logistics']
const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5', 'M1', 'M2', 'M3']

type View =
  | { mode: 'list' }
  | { mode: 'create-template' }
  | { mode: 'edit-template' }
  | { mode: 'add-kra' }
  | { mode: 'edit-kra'; kraCode: string }

function StatusBadge({ status }: { status: TemplateStatus }) {
  if (status === 'published') return <Badge tone="success">Published</Badge>
  if (status === 'draft') return <Badge tone="warning">Draft</Badge>
  return <Badge tone="gray">Archived</Badge>
}

function WeightStack({ items }: { items: KraItem[] }) {
  const palette = ['#465fff', '#7c5cff', '#10b981', '#fdb022', '#f97066', '#34d399']
  const total = items.reduce((s, i) => s + i.weight, 0) || 1
  return (
    <div className="overflow-hidden rounded-full">
      <div className="flex h-3 w-full">
        {items.map((it, i) => (
          <div
            key={it.code}
            title={`${it.title} · ${it.weight}%`}
            style={{ width: `${(it.weight / total) * 100}%`, background: palette[i % palette.length] }}
          />
        ))}
      </div>
    </div>
  )
}

function TemplateCard({ t, active, onClick }: { t: KraTemplateV2; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        active
          ? 'border-brand-500 bg-brand-50/40 shadow-sm dark:border-brand-500 dark:bg-brand-500/10'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            {Icon.layers}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{t.dept} · {t.level}</p>
          </div>
        </div>
        <StatusBadge status={t.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{t.summary}</p>
      <div className="mt-4 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
        <code className="rounded bg-gray-100 px-1.5 py-0.5 tabular-nums dark:bg-gray-800 dark:text-gray-300">{t.code}</code>
        <span>·</span>
        <span><strong className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">{t.items.length}</strong> KRAs</span>
        <span>·</span>
        <span>used by <strong className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">{t.usedBy}</strong></span>
      </div>
    </button>
  )
}

function TemplateDetail({ t, onEdit, onAddKra, onEditKra, onDeleteKra }: {
  t: KraTemplateV2
  onEdit: () => void
  onAddKra: () => void
  onEditKra: (kraCode: string) => void
  onDeleteKra: (kraCode: string) => void
}) {
  const total = t.items.reduce((s, i) => s + i.weight, 0)
  const balanced = total === 100

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">{t.code}</code>
            <StatusBadge status={t.status} />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Version {t.version} · updated {t.updated}</span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{t.name}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.summary}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200">
            {Icon.send}<span>Publish v{parseFloat(t.version.replace('v', '')) + 1}</span>
          </button>
          <button onClick={onEdit} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-semibold text-white hover:bg-brand-600">
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
          <div className="mt-2"><WeightStack items={t.items} /></div>
          <p className={`mt-1.5 text-xs ${balanced ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
            Total {total}% {balanced ? '· balanced' : '· must equal 100%'}
          </p>
        </div>
      </div>

      {/* KRA items table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="w-10 px-6 py-3" />
              <th className="px-3 py-3">Code</th>
              <th className="px-3 py-3">KRA</th>
              <th className="px-3 py-3">KPI / measurement</th>
              <th className="px-3 py-3 text-right">Weight</th>
              <th className="w-16 px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {t.items.map((it) => (
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
                  <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                    {it.weight}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onEditKra(it.code)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">{Icon.edit}</button>
                    <button
                      onClick={() => { if (window.confirm(`Delete ${it.code} — ${it.title}?`)) onDeleteKra(it.code) }}
                      className="rounded p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                    >{Icon.trash}</button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={6} className="px-6 py-3">
                <button
                  onClick={onAddKra}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                >
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
            { n: 1, label: 'Below',       desc: 'Did not meet expectations',      color: '#f04438' },
            { n: 2, label: 'Partial',     desc: 'Met some expectations',          color: '#f97066' },
            { n: 3, label: 'Meets',       desc: 'Met expectations consistently',  color: '#fdb022' },
            { n: 4, label: 'Exceeds',     desc: 'Exceeded in most areas',         color: '#84cc16' },
            { n: 5, label: 'Outstanding', desc: 'Exceeded in all areas',          color: '#12b76a' },
          ].map(s => (
            <div key={s.n} className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: s.color }}>{s.n}</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.label}</p>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Approval chain + evidence + cycle defaults */}
      <div className="grid grid-cols-1 gap-4 border-t border-gray-200 px-6 py-5 dark:border-gray-800 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Approval chain</p>
          <ol className="mt-2 space-y-1.5 text-sm">
            {['Self appraisal', 'Squad Leader', 'Head of Department', 'Head of Division'].map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">{i + 1}</span>
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
    </div>
  )
}

type TplFormData = { code: string; name: string; dept: string; level: string; summary: string; status: TemplateStatus }

function TemplateForm({ initial, onSave, onCancel }: {
  initial: KraTemplateV2 | null
  onSave: (d: TplFormData) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<TplFormData>(
    initial
      ? { code: initial.code, name: initial.name, dept: initial.dept, level: initial.level, summary: initial.summary, status: initial.status }
      : { code: '', name: '', dept: 'Engineering', level: 'L3', summary: '', status: 'draft' }
  )
  const up = (p: Partial<TplFormData>) => setForm(f => ({ ...f, ...p }))
  const valid = form.code.trim() && form.name.trim()

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
      <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
        ← Back to templates
      </button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {initial ? `Edit template · ${initial.name}` : 'New KRA template'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {initial ? 'Update position metadata and status.' : 'Bundle of KRAs auto-assigned to a position when a cycle starts.'}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02] space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Template code <span className="text-red-500">*</span>
            </label>
            <input
              value={form.code}
              onChange={e => up({ code: e.target.value.toUpperCase() })}
              placeholder="ENG-SE-V1"
              className={inputCls + ' tabular-nums'}
            />
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</label>
            <select value={form.status} onChange={e => up({ status: e.target.value as TemplateStatus })} className={inputCls}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Position name <span className="text-red-500">*</span>
            </label>
            <input value={form.name} onChange={e => up({ name: e.target.value })} placeholder="Software Engineer" className={inputCls} />
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Department</label>
            <select value={form.dept} onChange={e => up({ dept: e.target.value })} className={inputCls}>
              {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Level</label>
            <select value={form.level} onChange={e => up({ level: e.target.value })} className={inputCls}>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Summary</label>
            <textarea
              value={form.summary}
              onChange={e => up({ summary: e.target.value })}
              rows={2}
              placeholder="One-line description shown on the template card"
              className={inputCls}
            />
          </div>
        </div>
        {!initial && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
            After creating, you can add KRA items, set weights (must sum to 100%), and publish.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">
          Cancel
        </button>
        <button
          onClick={() => { if (valid) onSave(form) }}
          disabled={!valid}
          className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {initial ? 'Save template' : 'Create template'}
        </button>
      </div>
    </div>
  )
}

type KraFormData = { code: string; title: string; weight: number; kpi: string }

function KraItemForm({ initial, otherWeight, templateName, onSave, onCancel }: {
  initial: KraItem | null
  otherWeight: number
  templateName: string
  onSave: (d: KraFormData) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<KraFormData>(
    initial
      ? { code: initial.code, title: initial.title, weight: initial.weight, kpi: initial.kpi }
      : { code: '', title: '', weight: 10, kpi: '' }
  )
  const up = (p: Partial<KraFormData>) => setForm(f => ({ ...f, ...p }))
  const projectedTotal = otherWeight + Number(form.weight || 0)
  const overflow = projectedTotal > 100
  const valid = form.code.trim() && form.title.trim() && form.kpi.trim() && form.weight > 0 && !overflow

  return (
    <div className="mx-auto max-w-xl px-6 py-8 space-y-6">
      <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
        ← Back to {templateName}
      </button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {initial ? `Edit KRA · ${initial.code}` : 'Add KRA item'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {initial
            ? `Editing ${initial.code} in ${templateName}`
            : `New row in ${templateName} · weight contributes to 100% total`}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02] space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              value={form.code}
              onChange={e => up({ code: e.target.value.toUpperCase() })}
              placeholder="KRA-7"
              className={inputCls + ' tabular-nums'}
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Weight (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number" min="1" max="100"
              value={form.weight}
              onChange={e => up({ weight: parseInt(e.target.value || '0', 10) })}
              className={inputCls + ' tabular-nums'}
            />
            <span className="mt-1 block text-[11px] text-gray-400">
              Other items: {otherWeight}% · projected total {projectedTotal}%
            </span>
          </div>
        </div>
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            KRA title <span className="text-red-500">*</span>
          </label>
          <input
            value={form.title}
            onChange={e => up({ title: e.target.value })}
            placeholder="e.g. Reduce defect escape rate"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            KPI / measurement <span className="text-red-500">*</span>
          </label>
          <p className="mb-1.5 text-[11px] text-gray-400">How will success be measured? Be concrete.</p>
          <textarea
            value={form.kpi}
            onChange={e => up({ kpi: e.target.value })}
            rows={3}
            placeholder="e.g. Defects escaping to prod < 2 per cycle, MTTR < 1h"
            className={inputCls}
          />
        </div>
        {overflow && (
          <div className="rounded-xl border border-error-200 bg-error-50 px-3 py-2 text-xs text-error-700 dark:border-error-900/40 dark:bg-error-500/10 dark:text-error-300">
            Weight overflow: total would be {projectedTotal}%. Reduce other weights or this one.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">
          Cancel
        </button>
        <button
          onClick={() => { if (valid) onSave(form) }}
          disabled={!valid}
          className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {initial ? 'Save changes' : 'Add KRA'}
        </button>
      </div>
    </div>
  )
}

export function HrKraTemplatesPage() {
  const [templates, setTemplates] = useState<KraTemplateV2[]>(KRA_TEMPLATES)
  const [activeId, setActiveId] = useState<string>(KRA_TEMPLATES[0]?.id ?? '')
  const [filter, setFilter] = useState<TemplateStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<View>({ mode: 'list' })

  const active = templates.find(t => t.id === activeId) ?? templates[0]

  const visible = useMemo(() => templates.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false
    if (search && !(t.name + t.code + t.dept).toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [templates, filter, search])

  const filterChips: { id: TemplateStatus | 'all'; label: string; count: number }[] = [
    { id: 'all',       label: 'All',       count: templates.length },
    { id: 'published', label: 'Published', count: templates.filter(t => t.status === 'published').length },
    { id: 'draft',     label: 'Draft',     count: templates.filter(t => t.status === 'draft').length },
    { id: 'archived',  label: 'Archived',  count: templates.filter(t => t.status === 'archived').length },
  ]

  function saveTemplate(data: TplFormData) {
    if (view.mode === 'edit-template') {
      setTemplates(prev => prev.map(t => t.id === active.id ? { ...t, ...data } : t))
    } else {
      const nid = `tpl-${Date.now()}`
      setTemplates(prev => [...prev, { ...data, id: nid, version: 'v1', updated: 'today', usedBy: 0, items: [] }])
      setActiveId(nid)
    }
    setView({ mode: 'list' })
  }

  function saveKraItem(data: KraFormData) {
    setTemplates(prev => prev.map(t => {
      if (t.id !== active.id) return t
      if (view.mode === 'edit-kra') {
        return { ...t, items: t.items.map(it => it.code === (view as { mode: 'edit-kra'; kraCode: string }).kraCode ? { ...it, ...data } : it) }
      }
      const exists = t.items.some(it => it.code === data.code)
      if (exists) return { ...t, items: t.items.map(it => it.code === data.code ? { ...it, ...data } : it) }
      return { ...t, items: [...t.items, data] }
    }))
    setView({ mode: 'list' })
  }

  function deleteKraItem(kraCode: string) {
    setTemplates(prev => prev.map(t =>
      t.id === active.id ? { ...t, items: t.items.filter(it => it.code !== kraCode) } : t
    ))
  }

  // ── Full-page form views ──
  if (view.mode === 'create-template' || view.mode === 'edit-template') {
    return (
      <PageShell>
        <TemplateForm
          initial={view.mode === 'edit-template' ? active : null}
          onSave={saveTemplate}
          onCancel={() => setView({ mode: 'list' })}
        />
      </PageShell>
    )
  }

  if (view.mode === 'add-kra' || view.mode === 'edit-kra') {
    const kraCode = view.mode === 'edit-kra' ? view.kraCode : null
    const editingKra = kraCode ? (active.items.find(it => it.code === kraCode) ?? null) : null
    const otherWeight = kraCode
      ? active.items.filter(it => it.code !== kraCode).reduce((s, i) => s + i.weight, 0)
      : active.items.reduce((s, i) => s + i.weight, 0)
    return (
      <PageShell>
        <KraItemForm
          initial={editingKra}
          otherWeight={otherWeight}
          templateName={active.name}
          onSave={saveKraItem}
          onCancel={() => setView({ mode: 'list' })}
        />
      </PageShell>
    )
  }

  // ── List view ──
  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] px-6 py-8 space-y-6">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Master data</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">KRA Templates</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Per-position KRA bundles. Linked to positions; auto-assigned to employees when a cycle starts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icon.search}</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search templates…"
                className="h-10 w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
              />
            </div>
            <button
              onClick={() => setView({ mode: 'create-template' })}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
            >
              {Icon.plus}<span>New template</span>
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          {filterChips.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-white/[0.02] dark:text-gray-300 dark:ring-gray-800'
              }`}
            >
              {f.label}
              <span className={filter === f.id
                ? 'rounded bg-white/20 px-1.5 py-0.5 text-[10px]'
                : 'rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }>{f.count}</span>
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
              <TemplateCard key={t.id} t={t} active={t.id === activeId} onClick={() => setActiveId(t.id)} />
            ))}
          </div>
          <div className="xl:col-span-8">
            {active && (
              <TemplateDetail
                t={active}
                onEdit={() => setView({ mode: 'edit-template' })}
                onAddKra={() => setView({ mode: 'add-kra' })}
                onEditKra={kraCode => setView({ mode: 'edit-kra', kraCode })}
                onDeleteKra={deleteKraItem}
              />
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
