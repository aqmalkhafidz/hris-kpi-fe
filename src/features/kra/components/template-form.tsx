import { useState } from 'react';
import { DEPTS, LEVELS, inputCls } from '../constants';
import type { KraTemplateV2, TemplateStatus } from '../types';

export type TplFormData = {
  code: string;
  name: string;
  dept: string;
  level: string;
  summary: string;
  status: TemplateStatus;
};

export function TemplateForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: KraTemplateV2 | null;
  onSave: (d: TplFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<TplFormData>(
    initial
      ? {
          code: initial.code,
          name: initial.name,
          dept: initial.dept,
          level: initial.level,
          summary: initial.summary,
          status: initial.status,
        }
      : {
          code: '',
          name: '',
          dept: 'Engineering',
          level: 'L3',
          summary: '',
          status: 'draft',
        }
  );
  const up = (p: Partial<TplFormData>) => setForm((f) => ({ ...f, ...p }));
  const valid = form.code.trim() && form.name.trim();

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        ← Back to templates
      </button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {initial ? `Edit template · ${initial.name}` : 'New KRA template'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {initial
            ? 'Update position metadata and status.'
            : 'Bundle of KRAs auto-assigned to a position when a cycle starts.'}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02] space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Template code <span className="text-red-500">*</span>
            </label>
            <input
              value={form.code}
              onChange={(e) => up({ code: e.target.value.toUpperCase() })}
              placeholder="ENG-SE-V1"
              className={inputCls + ' tabular-nums'}
            />
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => up({ status: e.target.value as TemplateStatus })}
              className={inputCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Position name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => up({ name: e.target.value })}
              placeholder="Software Engineer"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Department
            </label>
            <select
              value={form.dept}
              onChange={(e) => up({ dept: e.target.value })}
              className={inputCls}
            >
              {DEPTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Level
            </label>
            <select
              value={form.level}
              onChange={(e) => up({ level: e.target.value })}
              className={inputCls}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Summary
            </label>
            <textarea
              value={form.summary}
              onChange={(e) => up({ summary: e.target.value })}
              rows={2}
              placeholder="One-line description shown on the template card"
              className={inputCls}
            />
          </div>
        </div>
        {!initial && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
            After creating, you can add KRA items, set weights (must sum to
            100%), and publish.
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
          {initial ? 'Save template' : 'Create template'}
        </button>
      </div>
    </div>
  );
}
