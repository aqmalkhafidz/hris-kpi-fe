import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { PageShell } from '../components/shell/page-shell'
import { Badge } from '../components/shell/badge'
import { Icon } from '../components/shell/icon'
import { Modal } from '../components/ui/modal'
import { CYCLES, Cycle, CycleStatus } from '../data/mock-cycles'

const inputCls = 'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90'

function CycleStatusBadge({ status }: { status: CycleStatus }) {
  if (status === 'active') return <Badge tone="success">Active</Badge>
  if (status === 'draft')  return <Badge tone="warning">Draft</Badge>
  return <Badge tone="gray">Closed</Badge>
}

function ProgressBar({ completed, inReview, draft, total }: { completed: number; inReview: number; draft: number; total: number }) {
  const t = total || 1
  const pending = Math.max(0, total - completed - inReview - draft)
  const bars = [
    { value: completed, color: '#12b76a', label: `${completed} completed` },
    { value: inReview,  color: '#465fff', label: `${inReview} in review` },
    { value: draft,     color: '#fdb022', label: `${draft} draft` },
    { value: pending,   color: '#e2dccb', label: `${pending} pending` },
  ]
  return (
    <div className="mt-4 space-y-2">
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {bars.map(b => (
          <div key={b.label} style={{ width: `${(b.value / t) * 100}%`, background: b.color }} title={b.label} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
        {bars.slice(0, 3).map(b => (
          <span key={b.label}>
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: b.color }} />
            {b.label}
          </span>
        ))}
      </div>
    </div>
  )
}

type CycleForm = { name: string; startDate: string; endDate: string; selfDeadline: string; status: CycleStatus; description: string }
const BLANK: CycleForm = { name: '', startDate: '', endDate: '', selfDeadline: '', status: 'draft', description: '' }

function CycleModal({ open, onClose, onSave, initial }: { open: boolean; onClose: () => void; onSave: (f: CycleForm) => void; initial: Cycle | null }) {
  const [form, setForm] = useState<CycleForm>(
    initial ? { name: initial.name, startDate: initial.startDate, endDate: initial.endDate, selfDeadline: initial.selfDeadline ?? '', status: initial.status, description: initial.description } : BLANK
  )
  const up = (p: Partial<CycleForm>) => setForm(f => ({ ...f, ...p }))
  const valid = form.name.trim() && form.startDate && form.endDate && new Date(form.startDate) <= new Date(form.endDate)

  return (
    <Modal open={open} onClose={onClose} title={initial ? `Edit cycle · ${initial.name}` : 'Cycle baru'}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">Batal</button>
          <button onClick={() => { onSave(form); onClose() }} disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            {initial ? 'Simpan' : 'Buat cycle'}
          </button>
        </>
      }>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Nama cycle <span className="text-error-500">*</span>
          </label>
          <input value={form.name} onChange={e => up({ name: e.target.value })} placeholder="Q2 2026 Appraisal" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Mulai <span className="text-error-500">*</span></label>
            <input type="date" value={form.startDate} onChange={e => up({ startDate: e.target.value })} className={inputCls + ' tabular-nums'} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Selesai <span className="text-error-500">*</span></label>
            <input type="date" value={form.endDate} onChange={e => up({ endDate: e.target.value })} className={inputCls + ' tabular-nums'} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Deadline self-appraisal</label>
            <input type="date" value={form.selfDeadline} onChange={e => up({ selfDeadline: e.target.value })} className={inputCls + ' tabular-nums'} />
            <p className="mt-1 text-[11px] text-gray-400">Default: akhir periode − 7 hari</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</label>
            <select value={form.status} onChange={e => up({ status: e.target.value as CycleStatus })} className={inputCls}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">Deskripsi</label>
          <textarea value={form.description} onChange={e => up({ description: e.target.value })} rows={2} className={inputCls} />
        </div>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
          Distribusi hanya bisa dijalankan setelah cycle ber-status <span className="rounded bg-white px-1 font-mono dark:bg-gray-800">active</span>.
        </div>
      </div>
    </Modal>
  )
}

function CycleCard({ c, onEdit, onActivate, onClose, onDelete }: {
  c: Cycle
  onEdit: (c: Cycle) => void
  onActivate: (id: string) => void
  onClose: (id: string) => void
  onDelete: (id: string) => void
}) {
  const completionPct = c.totalAppraisals > 0 ? Math.round((c.completed / c.totalAppraisals) * 100) : 0
  const inProgress = c.status === 'active' && c.totalAppraisals > 0

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CycleStatusBadge status={c.status} />
            <span className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400">{c.startDate} → {c.endDate}</span>
          </div>
          <h3 className="mt-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">{c.name}</h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{c.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {c.status === 'draft' && (
            <button onClick={() => onActivate(c.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success-600 px-3 text-xs font-semibold text-white hover:bg-success-700">
              {Icon.send}<span>Aktifkan</span>
            </button>
          )}
          {c.status === 'active' && (
            <button onClick={() => onClose(c.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200">
              {Icon.check}<span>Tutup cycle</span>
            </button>
          )}
          <button onClick={() => onEdit(c)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200">
            {Icon.edit}<span>Edit</span>
          </button>
          {c.status === 'draft' && c.totalAppraisals === 0 && (
            <button onClick={() => onDelete(c.id)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-error-300 hover:bg-error-50 hover:text-error-600 dark:border-gray-800 dark:bg-white/[0.02]">
              {Icon.trash}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Distribusi',   value: c.distributedAt ?? '—' },
          { label: 'Deadline self', value: c.selfDeadline ?? '—' },
          { label: 'Appraisal',    value: String(c.totalAppraisals) },
          { label: 'Selesai',      value: `${completionPct}%` },
        ].map(s => (
          <div key={s.label}>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {inProgress && <ProgressBar completed={c.completed} inReview={c.inReview} draft={c.draft} total={c.totalAppraisals} />}

      {c.status === 'active' && c.totalAppraisals === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-warning-300 bg-warning-50 px-4 py-3 text-xs text-warning-700 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-300">
          Cycle aktif tapi belum ada appraisal. Buka detail untuk jalankan distribusi.
        </div>
      )}

      <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800">
        <Link to="/hr/cycles/$cycleId" params={{ cycleId: c.id }}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Lihat detail &amp; distribusi →
        </Link>
      </div>
    </div>
  )
}

export function HrCyclesPage() {
  const [cycles, setCycles] = useState<Cycle[]>(CYCLES)
  const [filter, setFilter] = useState<'all' | CycleStatus>('all')
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Cycle | null>(null)

  const stats = useMemo(() => ({
    total:  cycles.length,
    active: cycles.filter(c => c.status === 'active').length,
    draft:  cycles.filter(c => c.status === 'draft').length,
    closed: cycles.filter(c => c.status === 'closed').length,
  }), [cycles])

  const visible = useMemo(() => cycles.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false
    if (search && !(c.name + c.description).toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [cycles, filter, search])

  const upsert = (form: CycleForm) => {
    setCycles(prev => {
      if (editing) return prev.map(c => c.id === editing.id ? { ...c, ...form, selfDeadline: form.selfDeadline || null } : c)
      const created: Cycle = {
        ...form, id: `cyc${Date.now()}`,
        selfDeadline: form.selfDeadline || null,
        distributedAt: null, totalAppraisals: 0,
        completed: 0, inReview: 0, draft: 0,
      }
      return [created, ...prev]
    })
  }

  const activate  = (id: string) => setCycles(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c))
  const closeCycle = (id: string) => {
    if (!confirm('Tutup cycle ini? Appraisal yang belum selesai tetap tersimpan.')) return
    setCycles(prev => prev.map(c => c.id === id ? { ...c, status: 'closed' } : c))
  }
  const remove = (id: string) => {
    if (!confirm('Hapus cycle draft ini? Tidak bisa di-undo.')) return
    setCycles(prev => prev.filter(c => c.id !== id))
  }

  const filterItems = [
    { id: 'all'    as const, label: 'Semua',  count: stats.total  },
    { id: 'active' as const, label: 'Active', count: stats.active },
    { id: 'draft'  as const, label: 'Draft',  count: stats.draft  },
    { id: 'closed' as const, label: 'Closed', count: stats.closed },
  ]

  return (
    <PageShell breadcrumb="Cycles">
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Appraisal setup</p>
            <h1 style={{ fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontWeight: 600, fontSize: '24px', color: 'var(--text-strong,#14182a)' }}>
              Cycles
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola periode appraisal dan distribusi karyawan.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icon.search}</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari cycle…"
                className="h-10 w-56 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200" />
            </div>
            <button onClick={() => setCreating(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
              {Icon.plus}<span>Cycle baru</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total cycle', value: stats.total,  tone: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',       icon: Icon.cycle },
            { label: 'Active',      value: stats.active, tone: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300', icon: Icon.send  },
            { label: 'Draft',       value: stats.draft,  tone: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300', icon: Icon.edit  },
            { label: 'Closed',      value: stats.closed, tone: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',               icon: Icon.check },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.tone}`}>{s.icon}</span>
              <p className="mt-3 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {filterItems.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-white/[0.02] dark:text-gray-300 dark:ring-gray-800'
              }`}>
              {f.label}
              <span className={filter === f.id ? 'rounded bg-white/20 px-1.5 py-0.5 text-[10px]' : 'rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400'}>
                {f.count}
              </span>
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
              onEdit={setEditing}
              onActivate={activate}
              onClose={closeCycle}
              onDelete={remove}
            />
          ))}
        </div>

      </div>

      <CycleModal open={creating} onClose={() => setCreating(false)} onSave={upsert} initial={null} />
      <CycleModal open={!!editing} onClose={() => setEditing(null)} onSave={upsert} initial={editing} />
    </PageShell>
  )
}
