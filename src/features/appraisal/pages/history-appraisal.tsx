import { useAuth } from '@features/auth/context/auth-context';
import { ROLE_LABELS } from '@features/auth/types';
import { PageShell } from '@shared/layouts/page-shell';
import type { Appraisal, AppraisalStatus } from '@shared/lib/types/appraisal';
import { Badge } from '@shared/ui/badge';
import { EmptyState } from '@shared/ui/empty-state';
import { PageHeader } from '@shared/ui/page-header';
import { TabStrip } from '@shared/ui/tab-strip';
import { useMemo, useState } from 'react';
import { PastCyclesCard } from '../components/past-cycles-card';
import { useScopedHistory } from '../hooks/use-appraisal';

type StatusGroup = 'all' | 'draft' | 'in_review' | 'completed';

const IN_REVIEW_STATUSES: AppraisalStatus[] = [
  'sl_review',
  'hod_review',
  'hodiv_review',
];

function selfAvg(a: Appraisal): number {
  const total = a.kras.reduce((s, k) => s + k.weight, 0) || 1;
  return a.kras.reduce((s, k) => s + k.self_score * k.weight, 0) / total;
}

const filterControlCls =
  'h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200';

const filterLabelCls =
  'text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500';

export function HistoryAppraisalPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useScopedHistory();
  const [filterUserId, setFilterUserId] = useState<number | 'all'>('all');
  const [statusGroup, setStatusGroup] = useState<StatusGroup>('all');
  const [filterCycle, setFilterCycle] = useState<string>('all');
  const [sortKey, setSortKey] = useState<
    'newest' | 'oldest' | 'score_desc' | 'score_asc'
  >('newest');

  const items = data?.items ?? [];
  const ownerLookup = data?.owners ?? {};
  const scopeLabel = data?.scopeLabel ?? '';

  const ownersInResults = useMemo(() => {
    const ids = Array.from(new Set(items.map((a) => a.userId)));
    return ids
      .map((id) => ownerLookup[id])
      .filter((u): u is NonNullable<typeof u> => Boolean(u));
  }, [items, ownerLookup]);

  const cycles = useMemo(() => {
    const seen = new Set<string>();
    return items
      .filter((a) => {
        if (seen.has(a.cycleName)) return false;
        seen.add(a.cycleName);
        return true;
      })
      .map((a) => ({ name: a.cycleName, short: a.cycleShort }))
      .sort((a, b) => b.name.localeCompare(a.name));
  }, [items]);

  const cycleCounts = useMemo(() => {
    const base =
      filterUserId === 'all'
        ? items
        : items.filter((a) => a.userId === filterUserId);
    return base.reduce<Record<string, number>>((acc, item) => {
      acc[item.cycleName] = (acc[item.cycleName] ?? 0) + 1;
      return acc;
    }, {});
  }, [items, filterUserId]);

  const employeeCounts = useMemo(() => {
    const base =
      filterCycle === 'all'
        ? items
        : items.filter((a) => a.cycleName === filterCycle);
    return base.reduce<Record<number, number>>((acc, item) => {
      acc[item.userId] = (acc[item.userId] ?? 0) + 1;
      return acc;
    }, {});
  }, [items, filterCycle]);

  const cycleOptions = useMemo(
    () =>
      cycles.filter(
        (cycle) =>
          filterUserId === 'all' ||
          cycleCounts[cycle.name] > 0 ||
          filterCycle === cycle.name
      ),
    [cycles, cycleCounts, filterCycle, filterUserId]
  );

  const employeeOptions = useMemo(
    () =>
      ownersInResults.filter(
        (owner) =>
          filterCycle === 'all' ||
          employeeCounts[owner.id] > 0 ||
          filterUserId === owner.id
      ),
    [employeeCounts, filterCycle, filterUserId, ownersInResults]
  );

  const countByGroup = useMemo(() => {
    const base =
      filterUserId === 'all'
        ? items
        : items.filter((a) => a.userId === filterUserId);
    const byCycle =
      filterCycle === 'all'
        ? base
        : base.filter((a) => a.cycleName === filterCycle);
    return {
      all: byCycle.length,
      draft: byCycle.filter((a) => a.status === 'draft').length,
      in_review: byCycle.filter((a) => IN_REVIEW_STATUSES.includes(a.status))
        .length,
      completed: byCycle.filter((a) => a.status === 'completed').length,
    };
  }, [items, filterUserId, filterCycle]);

  const visible = useMemo(() => {
    let result = items;

    if (statusGroup === 'draft')
      result = result.filter((a) => a.status === 'draft');
    else if (statusGroup === 'in_review')
      result = result.filter((a) => IN_REVIEW_STATUSES.includes(a.status));
    else if (statusGroup === 'completed')
      result = result.filter((a) => a.status === 'completed');

    if (filterUserId !== 'all')
      result = result.filter((a) => a.userId === filterUserId);
    if (filterCycle !== 'all')
      result = result.filter((a) => a.cycleName === filterCycle);

    if (sortKey === 'newest') {
      result = [...result].sort((a, b) =>
        (b.acknowledged_at ?? b.submittedAt ?? '').localeCompare(
          a.acknowledged_at ?? a.submittedAt ?? ''
        )
      );
    } else if (sortKey === 'oldest') {
      result = [...result].sort((a, b) =>
        (a.acknowledged_at ?? a.submittedAt ?? '').localeCompare(
          b.acknowledged_at ?? b.submittedAt ?? ''
        )
      );
    } else if (sortKey === 'score_desc') {
      result = [...result].sort((a, b) => selfAvg(b) - selfAvg(a));
    } else if (sortKey === 'score_asc') {
      result = [...result].sort((a, b) => selfAvg(a) - selfAvg(b));
    }

    return result;
  }, [items, statusGroup, filterUserId, filterCycle, sortKey]);

  if (!user) {
    return (
      <PageShell breadcrumb="History Appraisal">
        <EmptyState title="Sign in to view history." />
      </PageShell>
    );
  }

  const showOwner = user.role !== 'staff';
  const isFiltered =
    filterUserId !== 'all' || filterCycle !== 'all' || statusGroup !== 'all';
  const employeeSelectValue =
    filterUserId === 'all' ? 'all' : filterUserId.toString();
  const cycleScopeCount = Object.values(cycleCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const employeeScopeCount = Object.values(employeeCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const statusTabs = [
    { value: 'all' as StatusGroup, label: `All (${countByGroup.all})` },
    { value: 'draft' as StatusGroup, label: `Draft (${countByGroup.draft})` },
    {
      value: 'in_review' as StatusGroup,
      label: `In Review (${countByGroup.in_review})`,
    },
    {
      value: 'completed' as StatusGroup,
      label: `Completed (${countByGroup.completed})`,
    },
  ];

  function handleEmployeeChange(value: string) {
    setFilterUserId(value === 'all' ? 'all' : Number(value));
  }

  function clearFilters() {
    setFilterUserId('all');
    setFilterCycle('all');
    setStatusGroup('all');
  }

  return (
    <PageShell breadcrumb="History Appraisal">
      <PageHeader
        category={`History · ${ROLE_LABELS[user.role]}`}
        title="Appraisal History"
        description={scopeLabel}
        actions={
          <Badge tone="brand">
            {items.length} record{items.length === 1 ? '' : 's'}
          </Badge>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 overflow-x-auto pb-1">
          <TabStrip
            options={statusTabs}
            value={statusGroup}
            onChange={setStatusGroup}
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
            className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="score_desc">Score ↓</option>
            <option value="score_asc">Score ↑</option>
          </select>
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-9 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.04]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {(cycles.length > 1 || (showOwner && ownersInResults.length > 1)) && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
            {cycles.length > 1 && (
              <label className="min-w-0 md:w-48">
                <span className={filterLabelCls}>Cycle</span>
                <select
                  value={filterCycle}
                  onChange={(e) => setFilterCycle(e.target.value)}
                  className={`${filterControlCls} mt-1.5`}
                >
                  <option value="all">All cycles ({cycleScopeCount})</option>
                  {cycleOptions.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.short} ({cycleCounts[c.name] ?? 0})
                    </option>
                  ))}
                </select>
              </label>
            )}

            {showOwner && ownersInResults.length > 1 && (
              <label className="min-w-0 md:w-64">
                <span className={filterLabelCls}>Employee</span>
                <select
                  value={employeeSelectValue}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  className={`${filterControlCls} mt-1.5`}
                >
                  <option value="all">
                    All employees ({employeeScopeCount})
                  </option>
                  {employeeOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({employeeCounts[o.id] ?? 0})
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <EmptyState title="Loading history..." />
      ) : isError ? (
        <EmptyState
          title="Failed to load history"
          description="Check your connection and refresh the page."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No appraisals found"
          description={
            statusGroup !== 'all'
              ? `No ${statusGroup === 'in_review' ? 'in-review' : statusGroup} appraisals match the current filters.`
              : user.role === 'staff'
                ? 'No appraisals in your history yet.'
                : 'No appraisals in your scope yet.'
          }
        />
      ) : (
        <PastCyclesCard
          items={visible}
          title="Appraisals"
          description={`${visible.length} record${visible.length === 1 ? '' : 's'}${isFiltered ? ' · filtered' : ''}`}
          ownerLookup={ownerLookup}
          showOwner={showOwner}
        />
      )}
    </PageShell>
  );
}
