import { useState } from 'react';
import { inputCls } from '../constants';
import type { KraItem } from '../types';

export type KraFormData = {
  code: string;
  title: string;
  weight: number;
  kpi: string;
};

export function KraItemForm({
  initial,
  otherWeight,
  templateName,
  onSave,
  onCancel,
}: {
  initial: KraItem | null;
  otherWeight: number;
  templateName: string;
  onSave: (d: KraFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<KraFormData>(
    initial
      ? {
          code: initial.code,
          title: initial.title,
          weight: initial.weight,
          kpi: initial.kpi,
        }
      : { code: '', title: '', weight: 10, kpi: '' }
  );
  const up = (p: Partial<KraFormData>) => setForm((f) => ({ ...f, ...p }));
  const projectedTotal = otherWeight + Number(form.weight || 0);
  const overflow = projectedTotal > 100;
  const valid =
    form.code.trim() &&
    form.title.trim() &&
    form.kpi.trim() &&
    form.weight > 0 &&
    !overflow;

  return (
    <div className="mx-auto max-w-xl px-6 py-8 space-y-6">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        ← Back to {templateName}
      </button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {initial ? `Edit KRA · ${initial.code}` : 'Add KRA item'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {initial
            ? `Editing ${initial.code} in ${templateName}`
            : `New row in ${templateName} · weight contributes to 100% total`}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02] space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              value={form.code}
              onChange={(e) => up({ code: e.target.value.toUpperCase() })}
              placeholder="KRA-7"
              className={inputCls + ' tabular-nums'}
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Weight (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={form.weight}
              onChange={(e) =>
                up({ weight: parseInt(e.target.value || '0', 10) })
              }
              className={inputCls + ' tabular-nums'}
            />
            <span className="mt-1 block text-[11px] text-gray-400">
              Other items: {otherWeight}% · projected total {projectedTotal}%
            </span>
          </div>
        </div>
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            KRA title <span className="text-red-500">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => up({ title: e.target.value })}
            placeholder="e.g. Reduce defect escape rate"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            KPI / measurement <span className="text-red-500">*</span>
          </label>
          <p className="mb-1.5 text-[11px] text-gray-400">
            How will success be measured? Be concrete.
          </p>
          <textarea
            value={form.kpi}
            onChange={(e) => up({ kpi: e.target.value })}
            rows={3}
            placeholder="e.g. Defects escaping to prod < 2 per cycle, MTTR < 1h"
            className={inputCls}
          />
        </div>
        {overflow && (
          <div className="rounded-xl border border-error-200 bg-error-50 px-3 py-2 text-xs text-error-700 dark:border-error-900/40 dark:bg-error-500/10 dark:text-error-300">
            Weight overflow: total would be {projectedTotal}%. Reduce other
            weights or this one.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (valid) onSave(form);
          }}
          disabled={!valid}
          className="h-9 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {initial ? 'Save changes' : 'Add KRA'}
        </button>
      </div>
    </div>
  );
}
