import { ReactNode } from 'react';

export function PageHeader({
  category,
  title,
  description,
  actions,
}: {
  category?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {category && (
          <p className="mb-2 text-xs font-semibold uppercase text-brand-600 dark:text-brand-300">
            {category}
          </p>
        )}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
