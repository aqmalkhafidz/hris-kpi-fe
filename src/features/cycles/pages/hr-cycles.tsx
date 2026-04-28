import { Icon } from '@shared/layouts/icon';
import { PageShell } from '@shared/layouts/page-shell';
import { ConfirmModal } from '@shared/ui/confirm-modal';
import { useState, useMemo } from 'react';
import { CycleCard } from '../components/cycle-card';
import { CycleModal } from '../components/cycle-modal';
import type { CycleForm } from '../constants';
import { useCycles, useDeleteCycle, useUpsertCycle } from '../hooks/use-cycles';
import type { Cycle, CycleStatus } from '../types';

export function HrCyclesPage() {
  const { data: cycles = [] } = useCycles();
  const upsertCycle = useUpsertCycle();
  const deleteCycle = useDeleteCycle();
  const [filter, setFilter] = useState<'all' | CycleStatus>('all');
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Cycle | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const stats = useMemo(
    () => ({
      total: cycles.length,
      active: cycles.filter((c) => c.status === 'active').length,
      draft: cycles.filter((c) => c.status === 'draft').length,
      closed: cycles.filter((c) => c.status === 'closed').length,
    }),
    [cycles]
  );

  const visible = useMemo(
    () =>
      cycles.filter((c) => {
        if (filter !== 'all' && c.status !== filter) return false;
        if (
          search &&
          !(c.name + c.description).toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [cycles, filter, search]
  );

  const upsert = (form: CycleForm) => {
    upsertCycle.mutate({
      id: editing?.id,
      form: {
        ...form,
        selfDeadline: form.selfDeadline || null,
        distributedAt: editing?.distributedAt ?? null,
        totalAppraisals: editing?.totalAppraisals ?? 0,
        completed: editing?.completed ?? 0,
        inReview: editing?.inReview ?? 0,
        draft: editing?.draft ?? 0,
      },
    });
  };

  const activate = (id: number) => {
    const cycle = cycles.find((c) => c.id === id);
    if (cycle) upsertCycle.mutate({ id, form: { ...cycle, status: 'active' } });
  };
  const closeCycle = (id: number) => {
    setConfirmModal({
      open: true,
      title: 'Tutup Cycle',
      description:
        'Tutup cycle ini? Appraisal yang belum selesai tetap tersimpan.',
      onConfirm: () => {
        const cycle = cycles.find((c) => c.id === id);
        if (cycle)
          upsertCycle.mutate({ id, form: { ...cycle, status: 'closed' } });
        setConfirmModal((prev) => ({ ...prev, open: false }));
      },
    });
  };
  const remove = (id: number) => {
    setConfirmModal({
      open: true,
      title: 'Hapus Cycle',
      description: 'Hapus cycle draft ini? Tidak bisa di-undo.',
      onConfirm: () => {
        deleteCycle.mutate(id);
        setConfirmModal((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const filterItems = [
    { id: 'all' as const, label: 'Semua', count: stats.total },
    { id: 'active' as const, label: 'Active', count: stats.active },
    { id: 'draft' as const, label: 'Draft', count: stats.draft },
    { id: 'closed' as const, label: 'Closed', count: stats.closed },
  ];

  return (
    <PageShell breadcrumb="Cycles">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Appraisal setup
          </p>
          <h1
            style={{
              fontFamily: 'Fraunces,serif',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: '24px',
              color: 'var(--text-strong,#14182a)',
            }}
          >
            Cycles
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Kelola periode appraisal dan distribusi karyawan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {Icon.search}
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari cycle…"
              className="h-10 w-56 rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
            />
          </div>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
          >
            {Icon.plus}
            <span>Cycle baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: 'Total cycle',
            value: stats.total,
            tone: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
            icon: Icon.cycle,
          },
          {
            label: 'Active',
            value: stats.active,
            tone: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
            icon: Icon.send,
          },
          {
            label: 'Draft',
            value: stats.draft,
            tone: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
            icon: Icon.edit,
          },
          {
            label: 'Closed',
            value: stats.closed,
            tone: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
            icon: Icon.check,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.tone}`}
            >
              {s.icon}
            </span>
            <p className="mt-3 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filterItems.map((f) => (
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
            <span
              className={
                filter === f.id
                  ? 'rounded bg-white/20 px-1.5 py-0.5 text-[10px]'
                  : 'rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }
            >
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
        {visible.map((c) => (
          <CycleCard
            key={c.id}
            c={c}
            onEdit={setEditing}
            onActivate={activate}
            onClose={closeCycle}
            onDelete={remove}
          />
        ))}
      </div>

      <CycleModal
        open={creating}
        onClose={() => setCreating(false)}
        onSave={upsert}
        initial={null}
      />
      <CycleModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSave={upsert}
        initial={editing}
      />

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        description={confirmModal.description}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </PageShell>
  );
}
