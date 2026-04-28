import { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </p>
      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
