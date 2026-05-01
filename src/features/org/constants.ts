export const inp =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90';

export const NEEDS_SQUAD = (orgRole: string) => {
  const r = orgRole.toUpperCase();
  return r === 'STAFF' || r === 'SL';
};

export const DEPT_DIV: Record<string, string> = {
  Engineering: 'Technology',
  Product: 'Technology',
  Design: 'Technology',
  QA: 'Technology',
  Marketing: 'Business',
  Sales: 'Business',
  'Customer Care': 'Business',
  Logistics: 'Operations',
  Procurement: 'Operations',
  Finance: 'Corporate',
  'People (HR)': 'Corporate',
  Legal: 'Corporate',
};

export type TabId =
  | 'divisions'
  | 'departments'
  | 'positions'
  | 'employees'
  | 'jobTitles'
  | 'squads';
