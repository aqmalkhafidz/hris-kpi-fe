import { useState } from 'react'
import { Badge } from '@shared/ui/badge'
import { SectionCard } from '@shared/ui/section-card'
import { StatusBadge } from '@shared/ui/status-badge'
import { AuditTimeline } from '@shared/domain/audit-timeline'
import { Avatar } from '@shared/layouts/avatar'
import { Icon } from '@shared/layouts/icon'
import type { Appraisal } from '@shared/lib/types/appraisal'

function formatAckDate(iso?: string) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

interface OwnerLookup {
  id: number
  name: string
  initials: string
  position?: string
}

interface PastCyclesCardProps {
  items: Appraisal[]
  title?: string
  description?: string
  ownerLookup?: Record<number, OwnerLookup>
  showOwner?: boolean
}

export function PastCyclesCard({
  items,
  title = 'Past cycles',
  description,
  ownerLookup,
  showOwner = false,
}: PastCyclesCardProps) {
  const [openId, setOpenId] = useState<number | null>(null)
  if (!items.length) return null

  const desc = description ?? `${items.length} completed appraisal${items.length === 1 ? '' : 's'}`

  return (
    <SectionCard title={title} description={desc}>
      <ul className="space-y-3">
        {items.map(item => {
          const totalWeight = item.kras.reduce((sum, kra) => sum + kra.weight, 0) || 1
          const weighted = item.kras.reduce((sum, kra) => sum + kra.self_score * kra.weight, 0) / totalWeight
          const ackLabel = formatAckDate(item.acknowledged_at)
          const isOpen = openId === item.id
          const owner = showOwner ? ownerLookup?.[item.userId] : undefined
          return (
            <li key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {owner && <Avatar initials={owner.initials} size="sm" tone="brand" />}
                  <div className="min-w-0 flex-1">
                    {owner && (
                      <p className="truncate text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {owner.name}
                        {owner.position && <span className="ml-2 font-normal text-gray-400">· {owner.position}</span>}
                      </p>
                    )}
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{item.cycleName}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {item.cycleShort}{ackLabel ? ` · acknowledged ${ackLabel}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Self avg</p>
                    <p className="text-sm font-semibold tabular-nums text-gray-800 dark:text-gray-100">{weighted.toFixed(2)}/5</p>
                  </div>
                  <StatusBadge status={item.status} />
                  <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>{Icon.chev}</span>
                </div>
              </button>
              {isOpen && (
                <div className="grid gap-5 border-t border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03] lg:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">KRA scores</p>
                    <ul className="space-y-2">
                      {item.kras.map(kra => (
                        <li key={kra.id} className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{kra.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Weight {kra.weight}%</p>
                          </div>
                          <Badge tone="brand">{kra.self_score}/5</Badge>
                        </li>
                      ))}
                    </ul>
                    {item.reflection && (
                      <div className="mt-3 rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Reflection</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{item.reflection}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Audit trail</p>
                    <AuditTimeline entries={item.audit_log} />
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
