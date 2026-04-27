import { type AuditEntry, type AuditAction } from '@shared/lib/types/appraisal'
import { statusLabel } from '@shared/layouts/sidebar-badge'

const ACTION_LABEL: Record<AuditAction, string> = {
  submit: 'Submitted',
  approve: 'Approved',
  return: 'Returned',
  acknowledge: 'Acknowledged',
  score_change: 'Updated score',
  comment: 'Updated comment',
}

const ACTION_TONE: Record<AuditAction, string> = {
  submit: 'bg-brand-500',
  approve: 'bg-success-500',
  return: 'bg-warning-500',
  acknowledge: 'bg-blue-500',
  score_change: 'bg-gray-400',
  comment: 'bg-gray-400',
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  if (!entries?.length) {
    return (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        No history yet. Activity appears here once the appraisal moves between stages.
      </p>
    )
  }

  const ordered = [...entries].reverse()

  return (
    <ol className="space-y-4">
      {ordered.map((entry, idx) => {
        const tone = ACTION_TONE[entry.action] ?? 'bg-gray-400'
        const label = ACTION_LABEL[entry.action] ?? entry.action
        return (
          <li key={`${entry.timestamp}-${idx}`} className="relative pl-6">
            <span className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ${tone}`} />
            {idx < ordered.length - 1 && (
              <span className="absolute left-[5px] top-4 h-full w-px bg-gray-200 dark:bg-gray-800" />
            )}
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">by {entry.actor_name}</span>
              <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500">
                {formatTimestamp(entry.timestamp)}
              </span>
            </div>
            {(entry.from_status || entry.to_status) && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {entry.from_status ? statusLabel(entry.from_status) : '—'}
                {' → '}
                {entry.to_status ? statusLabel(entry.to_status) : '—'}
              </p>
            )}
            {entry.reason && (
              <p className="mt-1 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-xs text-warning-800 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-200">
                Reason: {entry.reason}
              </p>
            )}
          </li>
        )
      })}
    </ol>
  )
}
