import { Icon } from '@shared/layouts/icon';

export function ChecklistItem({
  done,
  children,
}: {
  done: boolean;
  children: string;
}) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-success-500 text-white' : 'border border-gray-300 text-transparent dark:border-gray-700'}`}
      >
        {Icon.check}
      </span>
      <span
        className={
          done
            ? 'text-gray-700 dark:text-gray-200'
            : 'text-gray-500 dark:text-gray-400'
        }
      >
        {children}
      </span>
    </li>
  );
}
