import { Icon } from '@shared/layouts/icon';
import type { AppraisalStatus } from '@shared/lib/types/appraisal';

const steps: { id: AppraisalStatus; label: string }[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'sl_review', label: 'SL' },
  { id: 'hod_review', label: 'HoD' },
  { id: 'hodiv_review', label: 'HoDiv' },
  { id: 'acknowledge', label: 'Acknowledge' },
  { id: 'completed', label: 'Completed' },
];

export function ApprovalStepper({ status }: { status: AppraisalStatus }) {
  const current = steps.findIndex((step) => step.id === status);
  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <div
            key={step.id}
            className="flex flex-1 items-center last:flex-none"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                  done
                    ? 'border-success-500 bg-success-500 text-white'
                    : active
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                      : 'border-gray-200 bg-white text-gray-400 dark:border-gray-800 dark:bg-white/[0.03]'
                }`}
              >
                {done ? Icon.check : index + 1}
              </span>
              <span
                className={`hidden text-xs font-medium sm:inline ${active ? 'text-brand-700 dark:text-brand-300' : 'text-gray-500 dark:text-gray-400'}`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-3 h-px flex-1 ${index < current ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-800'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
