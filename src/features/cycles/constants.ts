import type { CycleStatus } from './types';

export const inputCls =
  'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90';

export type CycleForm = {
  name: string;
  startDate: string;
  endDate: string;
  selfDeadline: string;
  status: CycleStatus;
  description: string;
};

export const BLANK_CYCLE_FORM: CycleForm = {
  name: '',
  startDate: '',
  endDate: '',
  selfDeadline: '',
  status: 'draft',
  description: '',
};
