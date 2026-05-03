import { Avatar } from '@shared/layouts/avatar';
import { Icon } from '@shared/layouts/icon';
import type { Appraisal } from '@shared/lib/types/appraisal';
import { Badge } from '@shared/ui/badge';
import { SectionCard } from '@shared/ui/section-card';
import { StatusBadge } from '@shared/ui/status-badge';
import { Link } from '@tanstack/react-router';

function formatAckDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface OwnerLookup {
  id: number;
  name: string;
  initials: string;
  position?: string;
}

interface PastCyclesCardProps {
  items: Appraisal[];
  title?: string;
  description?: string;
  ownerLookup?: Record<number, OwnerLookup>;
  showOwner?: boolean;
}

export function PastCyclesCard({
  items,
  title = 'Past cycles',
  description,
  ownerLookup,
  showOwner = false,
}: PastCyclesCardProps) {
  if (!items.length) return null;

  const desc =
    description ?? `${items.length} appraisal${items.length === 1 ? '' : 's'}`;

  return (
    <SectionCard title={title} description={desc}>
      <ul className="space-y-3">
        {items.map((item) => {
          const totalWeight =
            item.kras.reduce((sum, kra) => sum + kra.weight, 0) || 1;
          const selfWeighted =
            item.kras.reduce(
              (sum, kra) => sum + kra.self_score * kra.weight,
              0
            ) / totalWeight;
          const ackLabel = formatAckDate(item.acknowledged_at);
          const returnCount =
            item.audit_log?.filter((e) => e.action === 'return').length ?? 0;
          const owner = showOwner ? ownerLookup?.[item.userId] : undefined;

          return (
            <li
              key={item.id}
              className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800"
            >
              <Link
                to="/history-appraisal/$appraisalId"
                params={{ appraisalId: String(item.id) }}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {owner && (
                    <Avatar initials={owner.initials} size="sm" tone="brand" />
                  )}
                  <div className="min-w-0 flex-1">
                    {owner && (
                      <p className="truncate text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {owner.name}
                        {owner.position && (
                          <span className="ml-2 font-normal text-gray-400">
                            · {owner.position}
                          </span>
                        )}
                      </p>
                    )}
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {item.cycleName}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {item.cycleShort}
                      {ackLabel ? ` · acknowledged ${ackLabel}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Self avg
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-gray-800 dark:text-gray-100">
                      {selfWeighted.toFixed(2)}/5
                    </p>
                  </div>
                  {returnCount > 0 && (
                    <Badge tone="error">Returned {returnCount}×</Badge>
                  )}
                  <StatusBadge status={item.status} />
                  <span className="text-gray-400">{Icon.chev}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
