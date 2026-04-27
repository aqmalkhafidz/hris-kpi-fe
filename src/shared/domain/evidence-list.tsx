import { Evidence } from '@shared/lib/types/appraisal'
import { Icon } from '@shared/layouts/icon'

export type EvidenceItem = Evidence

export function EvidenceList({ items, onDelete }: { items: EvidenceItem[]; onDelete?: (index: number) => void }) {
  if (!items.length) return null
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={`${item.name}-${index}`} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-white/[0.03]">
          <span className={`mt-0.5 ${item.kind === 'url' ? 'text-blue-600 dark:text-blue-300' : 'text-brand-600 dark:text-brand-300'}`}>
            {item.kind === 'url' ? Icon.send : Icon.paper}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{item.name}</p>
            {item.kind === 'url' && item.url && (
              <a href={item.url} target="_blank" rel="noreferrer" className="mt-0.5 block truncate text-xs font-medium text-blue-600 hover:underline dark:text-blue-300">
                {item.url}
              </a>
            )}
            {item.description && item.description !== item.name && (
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">{item.description}</p>
            )}
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
          </div>
          {onDelete && (
            <button type="button" onClick={() => onDelete(index)} className="mt-0.5 text-gray-400 hover:text-error-600">
              {Icon.trash}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
