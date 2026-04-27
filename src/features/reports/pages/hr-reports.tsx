import { useState, useMemo, useEffect } from 'react'
import { PageShell } from '@shared/layouts/page-shell'
import { Badge } from '@shared/ui/badge'
import { Avatar } from '@shared/layouts/avatar'
import { Icon } from '@shared/layouts/icon'
import { CYCLES } from '@features/cycles/data/mock-cycles'

// ── Types ────────────────────────────────────────────────────────────────────

interface CompletedAppraisal {
  id: string
  cycleId: string
  employee: string
  nip: string
  dept: string
  division: string
  position: string
  finalScore: number
  calibratedScore: number | null
  finalGrade: string | null
  isCalibrated: boolean
  completedAt: string
}

// ── Mock data ────────────────────────────────────────────────────────────────

const COMPLETED: CompletedAppraisal[] = [
  { id:'a1',  cycleId:'cyc1', employee:'Aqmal Hidayat',   nip:'EMP-2021-0341', dept:'Engineering',   division:'Technology', position:'Software Engineer',          finalScore:4.32, calibratedScore:4.30, finalGrade:'B+', isCalibrated:true,  completedAt:'2026-04-02' },
  { id:'a2',  cycleId:'cyc1', employee:'Reno Saputra',    nip:'EMP-2023-0701', dept:'Engineering',   division:'Technology', position:'Software Engineer',          finalScore:3.88, calibratedScore:null, finalGrade:null, isCalibrated:false, completedAt:'2026-04-04' },
  { id:'a3',  cycleId:'cyc1', employee:'Rifky Oktaviano', nip:'EMP-2020-0218', dept:'Engineering',   division:'Technology', position:'Senior Software Engineer',   finalScore:4.65, calibratedScore:4.60, finalGrade:'A',  isCalibrated:true,  completedAt:'2026-04-05' },
  { id:'a4',  cycleId:'cyc1', employee:'Kirana Andini',   nip:'EMP-2022-0512', dept:'Design',        division:'Technology', position:'Product Designer',           finalScore:4.12, calibratedScore:null, finalGrade:null, isCalibrated:false, completedAt:'2026-04-06' },
  { id:'a5',  cycleId:'cyc1', employee:'Hendra Wijoyo',   nip:'EMP-2019-0188', dept:'Product',       division:'Technology', position:'Product Manager',            finalScore:4.04, calibratedScore:null, finalGrade:null, isCalibrated:false, completedAt:'2026-04-07' },
  { id:'a6',  cycleId:'cyc1', employee:'Citra Pertiwi',   nip:'EMP-2023-0815', dept:'Marketing',     division:'Business',   position:'Growth Marketer',            finalScore:3.45, calibratedScore:null, finalGrade:null, isCalibrated:false, completedAt:'2026-04-08' },
  { id:'a7',  cycleId:'cyc1', employee:'Bagas Widodo',    nip:'EMP-2022-0420', dept:'Customer Care', division:'Business',   position:'Customer Success Associate', finalScore:3.20, calibratedScore:null, finalGrade:null, isCalibrated:false, completedAt:'2026-04-08' },
  { id:'a8',  cycleId:'cyc1', employee:'Yoga Pradana',    nip:'EMP-2025-1102', dept:'Engineering',   division:'Technology', position:'Software Engineer',          finalScore:2.85, calibratedScore:null, finalGrade:null, isCalibrated:false, completedAt:'2026-04-09' },
  { id:'a9',  cycleId:'cyc1', employee:'Putri Anggraeni', nip:'EMP-2025-0303', dept:'Logistics',     division:'Operations', position:'Logistics Coordinator',      finalScore:3.95, calibratedScore:null, finalGrade:null, isCalibrated:false, completedAt:'2026-04-09' },
  { id:'a10', cycleId:'cyc1', employee:'Rangga Permana',  nip:'EMP-2024-0411', dept:'Sales',         division:'Business',   position:'Sales Lead',                 finalScore:4.45, calibratedScore:4.40, finalGrade:'A',  isCalibrated:true,  completedAt:'2026-04-10' },
  { id:'a11', cycleId:'cyc1', employee:'Mira Lestari',    nip:'EMP-2024-0903', dept:'Finance',       division:'Corporate',  position:'Accountant',                 finalScore:3.62, calibratedScore:null, finalGrade:null, isCalibrated:false, completedAt:'2026-04-10' },
  { id:'a12', cycleId:'cyc1', employee:'Dewi Larasati',   nip:'EMP-2018-0042', dept:'Engineering',   division:'Technology', position:'Engineering Manager',        finalScore:4.78, calibratedScore:4.75, finalGrade:'A',  isCalibrated:true,  completedAt:'2026-04-11' },
  { id:'a13', cycleId:'cyc2', employee:'Aqmal Hidayat',   nip:'EMP-2021-0341', dept:'Engineering',   division:'Technology', position:'Software Engineer',          finalScore:4.10, calibratedScore:4.10, finalGrade:'B+', isCalibrated:true,  completedAt:'2026-01-12' },
  { id:'a14', cycleId:'cyc2', employee:'Reno Saputra',    nip:'EMP-2023-0701', dept:'Engineering',   division:'Technology', position:'Software Engineer',          finalScore:3.55, calibratedScore:3.55, finalGrade:'B',  isCalibrated:true,  completedAt:'2026-01-12' },
]

const GRADE_OPTIONS = ['A', 'B+', 'B', 'C', 'D'] as const

// ── Helpers ──────────────────────────────────────────────────────────────────

function effectiveScore(a: CompletedAppraisal) {
  return a.isCalibrated && a.calibratedScore !== null ? a.calibratedScore : a.finalScore
}

function gradeFromScore(s: number): string {
  if (s >= 4.5) return 'A'
  if (s >= 4.0) return 'B+'
  if (s >= 3.5) return 'B'
  if (s >= 3.0) return 'C'
  return 'D'
}

function downloadCSV(filename: string, rows: string[][]) {
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return ''
    const s = String(v).replace(/"/g, '""')
    return /[",\n]/.test(s) ? `"${s}"` : s
  }
  const csv = rows.map(r => r.map(escape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}

// ── GradeBadge ────────────────────────────────────────────────────────────────

function GradeBadge({ g }: { g: string | null }) {
  if (!g) return <span className="text-gray-400">—</span>
  const tones: Record<string, string> = {
    'A':  'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300',
    'B+': 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
    'B':  'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    'C':  'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300',
    'D':  'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-300',
  }
  return (
    <span className={`inline-flex h-7 min-w-[36px] items-center justify-center rounded-md text-xs font-bold tabular-nums ${tones[g] ?? tones['B']}`}>
      {g}
    </span>
  )
}

// ── BellCurve ────────────────────────────────────────────────────────────────

interface BucketDatum { label: string; count: number }

function BellCurve({ data }: { data: BucketDatum[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  const palette: Record<string, string> = {
    '1.0–1.9': '#f04438',
    '2.0–2.9': '#f97066',
    '3.0–3.9': '#fdb022',
    '4.0–4.4': '#84cc16',
    '4.5–5.0': '#12b76a',
  }
  const total = data.reduce((s, d) => s + d.count, 0) || 1
  return (
    <div className="flex h-48 items-end gap-3">
      {data.map(d => {
        const h = (d.count / max) * 100
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-col items-center justify-end" style={{ height: '160px' }}>
              <span className="mb-1 text-[11px] font-semibold tabular-nums text-gray-700 dark:text-gray-200">{d.count}</span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{ height: `${h}%`, minHeight: d.count > 0 ? '4px' : '0', background: palette[d.label] ?? '#465fff' }}
              />
            </div>
            <p className="text-[11px] font-semibold tabular-nums text-gray-600 dark:text-gray-400">{d.label}</p>
            <p className="text-[10px] text-gray-400">{Math.round((d.count / total) * 100)}%</p>
          </div>
        )
      })}
    </div>
  )
}

// ── CalibrationModal ──────────────────────────────────────────────────────────

interface CalibrationModalProps {
  open: boolean
  appraisal: CompletedAppraisal | null
  onClose: () => void
  onSave: (id: string, score: number | null, grade: string | null) => void
}

const inputCls = 'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90'

function CalibrationModal({ open, appraisal, onClose, onSave }: CalibrationModalProps) {
  const [score, setScore] = useState<string>('')
  const [grade, setGrade] = useState<string>('')

  useEffect(() => {
    if (!appraisal) return
    setScore(String(appraisal.calibratedScore ?? appraisal.finalScore))
    setGrade(appraisal.finalGrade ?? gradeFromScore(appraisal.finalScore))
  }, [appraisal, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open || !appraisal) return null

  const parsed = parseFloat(score)
  const valid = !isNaN(parsed) && parsed >= 1 && parsed <= 5 && grade !== ''
  const suggested = gradeFromScore(parsed || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Calibrate · {appraisal.employee}</h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{appraisal.position} · {appraisal.dept} · NIP {appraisal.nip}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]">
            {Icon.x}
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-4">
          <div className="grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-3 dark:bg-white/[0.02]">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Original</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900 dark:text-white">{appraisal.finalScore.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Calibrated</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                {appraisal.calibratedScore !== null
                  ? appraisal.calibratedScore.toFixed(2)
                  : <span className="text-gray-400">—</span>}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Status</p>
              <p className="mt-1">
                {appraisal.isCalibrated
                  ? <Badge tone="success">Calibrated</Badge>
                  : <Badge tone="warning">Pending</Badge>}
              </p>
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Calibrated score (1.00 – 5.00) <span className="text-error-500">*</span>
            </span>
            <input
              type="number" step="0.01" min="1" max="5" value={score}
              onChange={e => { setScore(e.target.value); setGrade(gradeFromScore(parseFloat(e.target.value) || 0)) }}
              className={inputCls + ' tabular-nums'}
            />
            <span className="mt-1 block text-[11px] text-gray-400">Skala sama dengan rating self/reviewer</span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Final grade <span className="text-error-500">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {GRADE_OPTIONS.map(g => (
                <button key={g} type="button" onClick={() => setGrade(g)}
                  className={`h-10 min-w-[56px] rounded-lg px-3 text-sm font-bold tabular-nums transition-colors ${
                    grade === g
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200'
                  }`}>{g}</button>
              ))}
            </div>
            <span className="mt-1 block text-[11px] text-gray-400">Sistem nyaranin: {suggested} berdasarkan skor</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-white/[0.02]">
          <button onClick={onClose} className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200">
            Cancel
          </button>
          {appraisal.isCalibrated && (
            <button
              onClick={() => { onSave(appraisal.id, null, null); onClose() }}
              className="h-9 rounded-lg border border-error-300 bg-white px-4 text-sm font-semibold text-error-600 hover:bg-error-50 dark:border-error-500/40 dark:bg-white/[0.03] dark:text-error-300"
            >
              Reset calibration
            </button>
          )}
          <button
            onClick={() => { onSave(appraisal.id, parsed, grade); onClose() }}
            disabled={!valid}
            className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save calibration
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HrReportsPage() {
  const [appraisals, setAppraisals] = useState<CompletedAppraisal[]>(COMPLETED)
  const [cycleId, setCycleId] = useState('cyc1')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'calibrated'>('all')
  const [editing, setEditing] = useState<CompletedAppraisal | null>(null)

  const cycle = CYCLES.find(c => c.id === cycleId)
  const inCycle = useMemo(() => appraisals.filter(a => a.cycleId === cycleId), [appraisals, cycleId])

  const buckets = useMemo(() => {
    const labels = ['1.0–1.9', '2.0–2.9', '3.0–3.9', '4.0–4.4', '4.5–5.0']
    const result = labels.map(l => ({ label: l, count: 0 }))
    inCycle.forEach(a => {
      const s = effectiveScore(a)
      if (s < 2)        result[0].count++
      else if (s < 3)   result[1].count++
      else if (s < 4)   result[2].count++
      else if (s < 4.5) result[3].count++
      else              result[4].count++
    })
    return result
  }, [inCycle])

  const stats = useMemo(() => {
    const total = inCycle.length
    const calibrated = inCycle.filter(a => a.isCalibrated).length
    const avg = total > 0 ? inCycle.reduce((s, a) => s + effectiveScore(a), 0) / total : 0
    return { total, calibrated, pending: total - calibrated, avg }
  }, [inCycle])

  const visible = useMemo(() => inCycle.filter(a => {
    if (filter === 'calibrated' && !a.isCalibrated) return false
    if (filter === 'pending' && a.isCalibrated) return false
    if (search) {
      const q = search.toLowerCase()
      if (!(a.employee + a.nip + a.dept + a.position).toLowerCase().includes(q)) return false
    }
    return true
  }), [inCycle, filter, search])

  const saveCalibration = (id: string, score: number | null, grade: string | null) => {
    setAppraisals(prev => prev.map(a => a.id === id
      ? { ...a, calibratedScore: score, finalGrade: grade, isCalibrated: score !== null }
      : a
    ))
  }

  const exportCsv = () => {
    const header = ['Employee ID', 'Name', 'Department', 'Job Title', 'Cycle', 'Original Final Score', 'Calibrated Score', 'Final Grade', 'Calibration Status']
    const rows = [header, ...inCycle.map(a => [
      a.nip, a.employee, a.dept, a.position, cycle?.name ?? cycleId,
      a.finalScore.toFixed(2),
      a.calibratedScore !== null ? a.calibratedScore.toFixed(2) : '',
      a.finalGrade ?? '',
      a.isCalibrated ? 'calibrated' : 'pending',
    ])]
    downloadCSV(`appraisal-report-${cycleId}-${new Date().toISOString().slice(0, 10)}.csv`, rows)
  }

  const filterTabs = [
    { id: 'all' as const,        label: 'All',        count: stats.total },
    { id: 'pending' as const,    label: 'Pending',    count: stats.pending },
    { id: 'calibrated' as const, label: 'Calibrated', count: stats.calibrated },
  ]

  const primaryActions = (
    <div className="hidden md:flex items-center gap-2">
      <button onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200">
        {Icon.print}<span>Print</span>
      </button>
      <button onClick={exportCsv} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
        {Icon.download}<span>Export CSV</span>
      </button>
    </div>
  )

  return (
    <PageShell breadcrumb="Reports" primary={primaryActions}>
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">

        {/* heading + cycle picker */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Appraisal setup</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reports</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Hanya menampilkan appraisal ber-status <code className="rounded bg-gray-100 px-1 text-[11px] dark:bg-gray-800">completed</code>.
              Bell curve pakai calibrated score kalau sudah dikalibrasi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={cycleId}
              onChange={e => { setCycleId(e.target.value); setFilter('all') }}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
            >
              {CYCLES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={() => window.print()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 md:hidden dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200">
              {Icon.print}<span>Print</span>
            </button>
            <button onClick={exportCsv} className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 md:hidden">
              {Icon.download}<span>CSV</span>
            </button>
          </div>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Cycle</p>
            <p className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">{cycle?.name ?? '—'}</p>
            <p className="mt-0.5 text-[11px] tabular-nums text-gray-500 dark:text-gray-400">{cycle?.startDate} → {cycle?.endDate}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Completed</p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Calibrated / pending</p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
              {stats.calibrated}<span className="text-base text-gray-400"> / {stats.pending}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Avg score</p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
              {stats.avg.toFixed(2)}<span className="ml-1 text-xs text-gray-400">/ 5.00</span>
            </p>
          </div>
        </div>

        {/* bell curve */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Score distribution</p>
              <h2 className="mt-1 text-base font-semibold tracking-tight text-gray-900 dark:text-white">Bell curve · {cycle?.name}</h2>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Pakai calibrated score kalau ada</p>
          </div>
          <div className="mt-5">
            {stats.total === 0
              ? <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">Belum ada appraisal completed di cycle ini.</div>
              : <BellCurve data={buckets} />
            }
          </div>
        </div>

        {/* filter tabs + search */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map(f => (
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
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icon.search}</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…"
              className="h-10 w-72 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
            />
          </div>
        </div>

        {/* table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left dark:border-gray-800">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Employee</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Position</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Final</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Calibrated</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Grade</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      Tidak ada appraisal untuk filter ini.
                    </td>
                  </tr>
                )}
                {visible.map(a => (
                  <tr key={a.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={a.employee.split(' ').map(w => w[0]).slice(0, 2).join('')} size="sm" tone="brand" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{a.employee}</p>
                          <p className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400">{a.nip} · {a.dept}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{a.position}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{a.division}</p>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-gray-700 dark:text-gray-300">
                      {a.finalScore.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {a.calibratedScore !== null
                        ? <span className="font-semibold tabular-nums text-gray-900 dark:text-white">{a.calibratedScore.toFixed(2)}</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-3"><GradeBadge g={a.finalGrade} /></td>
                    <td className="px-3 py-3">
                      {a.isCalibrated
                        ? <Badge tone="success">Calibrated</Badge>
                        : <Badge tone="warning">Pending</Badge>}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setEditing(a)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
                      >
                        {Icon.edit}<span>Calibrate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSV legend */}
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
          <p className="font-semibold text-gray-700 dark:text-gray-200">CSV columns</p>
          <p className="mt-2 leading-relaxed">
            Employee ID · Name · Department · Job Title · Cycle · Original Final Score · Calibrated Score · Final Grade · Calibration Status
          </p>
          <p className="mt-2">
            Bell curve pakai <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">calibrated_score</code> kalau appraisal sudah dikalibrasi,
            kalau belum pakai <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">final_score</code>.
            Print view via <kbd className="rounded border border-gray-300 px-1.5 py-0.5 font-sans dark:border-gray-700">Cmd/Ctrl + P</kbd>.
          </p>
        </div>
      </div>

      <CalibrationModal
        open={!!editing}
        appraisal={editing}
        onClose={() => setEditing(null)}
        onSave={saveCalibration}
      />
    </PageShell>
  )
}
