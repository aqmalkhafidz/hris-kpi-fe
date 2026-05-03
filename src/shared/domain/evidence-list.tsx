import { useProtectedObjectUrl } from '@shared/hooks/use-protected-object-url';
import { Icon } from '@shared/layouts/icon';
import { Evidence } from '@shared/lib/types/appraisal';

export type EvidenceItem = Evidence;

function canOpenInBrowser(mimeType: string | null, fileName: string): boolean {
  if (mimeType) {
    if (mimeType.startsWith('image/')) return true;
    if (mimeType.startsWith('text/')) return true;
    if (mimeType === 'application/pdf') return true;
    if (mimeType === 'application/json') return true;
    if (mimeType === 'application/xml' || mimeType === 'text/xml') return true;
    return false;
  }

  const lower = fileName.toLowerCase();
  return (
    lower.endsWith('.pdf') ||
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.gif') ||
    lower.endsWith('.txt') ||
    lower.endsWith('.md') ||
    lower.endsWith('.json') ||
    lower.endsWith('.xml')
  );
}

function FileEvidence({ item }: { item: Evidence }) {
  const { src, mimeType, loading } = useProtectedObjectUrl(item.url ?? null);
  const isImage = Boolean(src && mimeType?.startsWith('image/'));
  const isPdf = Boolean(src && mimeType === 'application/pdf');
  const openable = canOpenInBrowser(mimeType, item.name);

  return (
    <>
      {src && (
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="mt-0.5 block truncate text-xs font-medium text-blue-600 hover:underline dark:text-blue-300"
          {...(openable ? {} : { download: item.name })}
        >
          {openable ? 'Open file' : 'Download file'}
        </a>
      )}
      {loading && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Preparing preview...
        </p>
      )}
      {isImage && (
        <img
          src={src!}
          alt=""
          className="mt-2 h-28 w-full rounded-lg border border-gray-200 bg-white object-cover dark:border-gray-700"
        />
      )}
      {isPdf && (
        <iframe
          src={src!}
          title={item.name}
          className="mt-2 h-52 w-full rounded-lg border border-gray-200 bg-white dark:border-gray-700"
        />
      )}
    </>
  );
}

export function EvidenceList({
  items,
  onDelete,
}: {
  items: EvidenceItem[];
  onDelete?: (index: number) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-sm dark:border-gray-800 dark:bg-white/[0.06]"
        >
          <span
            className={`mt-0.5 ${item.kind === 'url' ? 'text-blue-600 dark:text-blue-300' : 'text-brand-600 dark:text-brand-300'}`}
          >
            {item.kind === 'url' ? Icon.send : Icon.paper}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
              {item.name}
            </p>
            {item.kind === 'url' && item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 block truncate text-xs font-medium text-blue-600 hover:underline dark:text-blue-300"
              >
                {item.url}
              </a>
            )}
            {item.kind === 'file' && <FileEvidence item={item} />}
            {item.description && item.description !== item.name && (
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            )}
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {item.date}
            </p>
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="mt-0.5 text-gray-400 hover:text-error-600"
            >
              {Icon.trash}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
