export const STATUS_FLOW = [
  { key: 'draft', label: 'Draft', actor: 'You' },
  { key: 'sl_review', label: 'SL Review', actor: 'Squad Leader' },
  { key: 'hod_review', label: 'HoD Review', actor: 'Head of Dept' },
  { key: 'hodiv_review', label: 'HoDiv Review', actor: 'Head of Div' },
  { key: 'completed', label: 'Completed', actor: 'HR' },
] as const;

export const STATUS_BADGE: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  sl_review:
    'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
  hod_review:
    'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
  hodiv_review:
    'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
  completed:
    'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
};

export const reviewRoutes = {
  sl: '/review/sl/$appraisalId',
  hod: '/review/hod/$appraisalId',
  hodiv: '/review/hodiv/$appraisalId',
} as const;
