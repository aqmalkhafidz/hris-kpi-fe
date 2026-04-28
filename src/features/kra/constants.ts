export const inputCls =
  'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90';

export const DEPTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Customer Care',
  'Finance',
  'People (HR)',
  'Logistics',
];

export const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5', 'M1', 'M2', 'M3'];

export type View =
  | { mode: 'list' }
  | { mode: 'create-template' }
  | { mode: 'edit-template' }
  | { mode: 'add-kra' }
  | { mode: 'edit-kra'; kraCode: string };
