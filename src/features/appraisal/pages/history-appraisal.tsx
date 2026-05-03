import { useAuth } from '@features/auth/context/auth-context';
import { ROLE_LABELS } from '@features/auth/types';
import { PageShell } from '@shared/layouts/page-shell';
import { Badge } from '@shared/ui/badge';
import { EmptyState } from '@shared/ui/empty-state';
import { PageHeader } from '@shared/ui/page-header';
import { SectionCard } from '@shared/ui/section-card';
import { useMemo, useState } from 'react';
import { PastCyclesCard } from '../components/past-cycles-card';
import { useScopedHistory } from '../hooks/use-appraisal';

export function HistoryAppraisalPage() {
  const { user } = useAuth();
  const { data, isLoading } = useScopedHistory();
  const [filterUserId, setFilterUserId] = useState<number | 'all'>('all');

  const items = data?.items ?? [];
  const ownerLookup = data?.owners ?? {};
  const scopeLabel = data?.scopeLabel ?? '';

  const visible =
    filterUserId === 'all'
      ? items
      : items.filter((a) => a.userId === filterUserId);

  const ownersInResults = useMemo(() => {
    const ids = Array.from(new Set(items.map((a) => a.userId)));
    return ids
      .map((id) => ownerLookup[id])
      .filter((u): u is NonNullable<typeof u> => Boolean(u));
  }, [items, ownerLookup]);

  if (!user) {
    return (
      <PageShell breadcrumb="History Appraisal">
        <EmptyState title="Sign in to view history." />
      </PageShell>
    );
  }

  const showOwner = user.role !== 'staff';

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

      {showOwner && ownersInResults.length > 1 && (
        <SectionCard>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Filter by employee:
            </span>
            <button
              type="button"
              onClick={() => setFilterUserId('all')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filterUserId === 'all'
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              All ({items.length})
            </button>
            {ownersInResults.map((o) => {
              const count = items.filter((a) => a.userId === o.id).length;
              const active = filterUserId === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setFilterUserId(o.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    active
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {o.name} ({count})
                </button>
              );
            })}
          </div>
        </SectionCard>
      )}

      {isLoading ? (
        <EmptyState title="Loading history..." />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No completed appraisals yet"
          description={
            user.role === 'staff'
              ? 'Once your cycle is approved and acknowledged, it will appear here.'
              : 'No completed cycles in your scope yet.'
          }
        />
      ) : (
        <PastCyclesCard
          items={visible}
          title="Completed cycles"
          description={`${visible.length} record${visible.length === 1 ? '' : 's'}${filterUserId !== 'all' ? ' · filtered' : ''}`}
          ownerLookup={ownerLookup}
          showOwner={showOwner}
        />
      )}
    </PageShell>
  );
}
