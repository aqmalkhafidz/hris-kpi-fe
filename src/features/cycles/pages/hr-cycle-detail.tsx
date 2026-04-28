import { Avatar } from '@shared/layouts/avatar';
import { Icon } from '@shared/layouts/icon';
import { PageShell } from '@shared/layouts/page-shell';
import { Link, useParams } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { CycleStatusBadge } from '../components/cycle-status-badge';
import { DistStatusBadge } from '../components/dist-status-badge';
import { EditCycleModal } from '../components/edit-cycle-modal';
import { ProgressBar } from '../components/progress-bar';
import { ReviewerChain } from '../components/reviewer-chain';
import type { CycleForm } from '../constants';
import {
  useCycleDistribution,
  useCycles,
  useDistributeCycle,
  useUpsertCycle,
  type DistStatus,
} from '../hooks/use-cycles';

export function HrCycleDetailPage() {
  const { cycleId } = useParams({ strict: false }) as { cycleId: string };
  const numericCycleId = Number(cycleId);

  const { data: cycles = [] } = useCycles();
  const upsertCycle = useUpsertCycle();
  const distributeCycle = useDistributeCycle();
  const { data: preview = [] } = useCycleDistribution(
    Number.isInteger(numericCycleId) ? numericCycleId : null
  );
  const [distFilter, setDistFilter] = useState<'all' | DistStatus>('all');
  const [search, setSearch] = useState('');
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<{
    when: string;
    matched: number;
    skipped: number;
  } | null>(null);
  const [editing, setEditing] = useState(false);

  const cycle = cycles.find((c) => c.id === numericCycleId);

  if (!cycle) {
    return (
      <PageShell breadcrumb="Cycle Detail" maxWidth="5xl">
        <p className="text-sm text-gray-500">Cycle tidak ditemukan.</p>
        <Link
          to="/hr/cycles"
          className="mt-3 inline-block text-sm font-semibold text-brand-600"
        >
          ← Kembali ke Cycles
        </Link>
      </PageShell>
    );
  }

  const distStats = useMemo(() => {
    let matched = 0,
      no_template = 0,
      already = 0,
      no_reviewer = 0;
    preview.forEach((r) => {
      if (r.status === 'matched') matched++;
      if (r.status === 'skipped_no_template') no_template++;
      if (r.status === 'skipped_already') already++;
      if (r.status === 'skipped_no_reviewer') no_reviewer++;
    });
    return {
      total: preview.length,
      matched,
      no_template,
      already,
      no_reviewer,
    };
  }, [preview]);

  const visible = useMemo(
    () =>
      preview.filter((r) => {
        if (distFilter !== 'all' && r.status !== distFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !(
              r.employee.name +
              r.employee.nip +
              r.employee.position +
              r.employee.dept
            )
              .toLowerCase()
              .includes(q)
          )
            return false;
        }
        return true;
      }),
    [preview, distFilter, search]
  );

  const completionPct =
    cycle.totalAppraisals > 0
      ? Math.round((cycle.completed / cycle.totalAppraisals) * 100)
      : 0;
  const inProgress = cycle.status === 'active' && cycle.totalAppraisals > 0;
  const canDistribute =
    cycle.status === 'active' && distStats.matched > 0 && !running;

  const runDistribution = () => {
    if (!canDistribute) return;
    setRunning(true);
    distributeCycle.mutate(cycle.id, {
      onSuccess: (result) => {
        setLastRun({
          when: new Date().toLocaleString('id-ID'),
          matched: result.created,
          skipped: result.skipped,
        });
      },
      onSettled: () => setRunning(false),
    });
  };

  const activate = () =>
    upsertCycle.mutate({ id: cycle.id, form: { ...cycle, status: 'active' } });
  const closeCycle = () => {
    if (
      !confirm('Tutup cycle ini? Appraisal yang belum selesai tetap tersimpan.')
    )
      return;
    upsertCycle.mutate({ id: cycle.id, form: { ...cycle, status: 'closed' } });
  };
  const saveEdit = (form: CycleForm) =>
    upsertCycle.mutate({
      id: cycle.id,
      form: { ...cycle, ...form, selfDeadline: form.selfDeadline || null },
    });

  const distFilterItems = [
    { id: 'all' as const, label: 'Semua', count: distStats.total },
    { id: 'matched' as const, label: 'Matched', count: distStats.matched },
    {
      id: 'skipped_no_template' as const,
      label: 'No template',
      count: distStats.no_template,
    },
    {
      id: 'skipped_already' as const,
      label: 'Already',
      count: distStats.already,
    },
    {
      id: 'skipped_no_reviewer' as const,
      label: 'No reviewer',
      count: distStats.no_reviewer,
    },
  ];

  return (
    <PageShell breadcrumb={cycle.name} maxWidth="5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link
          to="/hr/cycles"
          className="hover:text-brand-600 dark:hover:text-brand-400"
        >
          Cycles
        </Link>
        <span className="text-gray-300">{Icon.chev}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {cycle.name}
        </span>
      </div>

      {/* Cycle header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CycleStatusBadge status={cycle.status} />
              <span className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
                {cycle.startDate} → {cycle.endDate}
              </span>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {cycle.name}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {cycle.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cycle.status === 'draft' && (
              <button
                onClick={activate}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success-600 px-3 text-xs font-semibold text-white hover:bg-success-700"
              >
                {Icon.send}
                <span>Aktifkan</span>
              </button>
            )}
            {cycle.status === 'active' && (
              <button
                onClick={closeCycle}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
              >
                {Icon.check}
                <span>Tutup cycle</span>
              </button>
            )}
            <button
              onClick={() => setEditing(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
            >
              {Icon.edit}
              <span>Edit</span>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Distribusi', value: cycle.distributedAt ?? '—' },
            { label: 'Deadline self', value: cycle.selfDeadline ?? '—' },
            { label: 'Appraisal', value: String(cycle.totalAppraisals) },
            { label: 'Selesai', value: `${completionPct}%` },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {s.label}
              </p>
              <p className="mt-1 text-base font-semibold tabular-nums text-gray-900 dark:text-white">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {inProgress && (
          <div className="mt-5">
            <ProgressBar
              completed={cycle.completed}
              inReview={cycle.inReview}
              draft={cycle.draft}
              total={cycle.totalAppraisals}
            />
          </div>
        )}
      </div>

      {/* Distribution section */}
      {cycle.status !== 'active' ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:bg-white/[0.02]">
          {cycle.status === 'draft'
            ? 'Aktifkan cycle terlebih dahulu untuk menjalankan distribusi.'
            : 'Cycle sudah ditutup. Distribusi tidak bisa dijalankan.'}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Distribusi Appraisal
              </h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Match template berdasarkan{' '}
                <span className="font-mono">division + position</span>. Snapshot
                reviewer di-copy saat distribusi.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={runDistribution}
                disabled={!canDistribute}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Icon.send}
                <span>{running ? 'Mendistribusikan…' : 'Distribute Now'}</span>
              </button>
              {distStats.matched === 0 && !running && (
                <p className="text-[11px] text-gray-400">
                  Semua karyawan sudah ter-distribusi atau tidak ada template.
                </p>
              )}
            </div>
          </div>

          {lastRun && (
            <div className="rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-300">
              <span className="font-semibold">
                {Icon.check} Distribusi selesai · {lastRun.when}
              </span>
              <span className="ml-4 tabular-nums">
                <strong>{lastRun.matched}</strong> appraisal terbentuk
              </span>
              <span className="ml-3 tabular-nums">
                <strong>{lastRun.skipped}</strong> di-skip
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              {
                label: 'Total employee',
                value: distStats.total,
                tone: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
              },
              {
                label: 'Matched',
                value: distStats.matched,
                tone: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
              },
              {
                label: 'No template',
                value: distStats.no_template,
                tone: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
              },
              {
                label: 'Already',
                value: distStats.already,
                tone: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
              },
              {
                label: 'No reviewer',
                value: distStats.no_reviewer,
                tone: 'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-300',
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
                <p
                  className={`mt-2 inline-flex rounded-lg px-2 py-0.5 text-2xl font-bold tabular-nums ${s.tone}`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {distFilterItems.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDistFilter(f.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    distFilter === f.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-white/[0.02] dark:text-gray-300 dark:ring-gray-800'
                  }`}
                >
                  {f.label}
                  <span
                    className={
                      distFilter === f.id
                        ? 'rounded bg-white/20 px-1.5 py-0.5 text-[10px]'
                        : 'rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }
                  >
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {Icon.search}
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari karyawan…"
                className="h-10 w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <th className="px-5 py-3 font-semibold">Karyawan</th>
                    <th className="px-3 py-3 font-semibold">Posisi</th>
                    <th className="px-3 py-3 font-semibold">Template</th>
                    <th className="px-3 py-3 font-semibold">Reviewer chain</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                      >
                        Tidak ada karyawan untuk filter ini.
                      </td>
                    </tr>
                  )}
                  {visible.map((r) => (
                    <tr
                      key={r.employee.id}
                      className="border-b border-gray-100 last:border-0 dark:border-gray-800/60"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            initials={r.employee.name
                              .split(' ')
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join('')}
                            size="sm"
                            tone="brand"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {r.employee.name}
                            </p>
                            <p className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
                              {r.employee.nip} · {r.employee.dept}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {r.employee.position}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {r.employee.division}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        {r.template ? (
                          <div>
                            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {r.template.code}
                            </code>
                            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                              {r.template.name}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <ReviewerChain emp={r.employee} />
                      </td>
                      <td className="px-3 py-3">
                        <DistStatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-3 text-[11px] text-gray-500 dark:text-gray-400">
                        {r.reason ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-xs text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
            <p className="font-semibold text-gray-700 dark:text-gray-200">
              Logika distribusi
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Match template berdasarkan kombinasi{' '}
                <span className="font-mono">division + position</span> karyawan.
              </li>
              <li>
                Snapshot reviewer (SL/HoD/HoDiv) di-copy ke appraisal saat
                distribusi berjalan.
              </li>
              <li>
                Karyawan di-skip kalau sudah punya appraisal di cycle yang sama.
              </li>
            </ul>
          </div>
        </>
      )}

      {editing && (
        <EditCycleModal
          open={editing}
          onClose={() => setEditing(false)}
          cycle={cycle}
          onSave={saveEdit}
        />
      )}
    </PageShell>
  );
}
