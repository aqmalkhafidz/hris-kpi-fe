import { useState, useMemo, useEffect } from 'react';
import {
  useDivisions,
  useDepartments,
  usePositions,
} from '../../org/hooks/use-org';
import { inputCls } from '../constants';
import type { KraTemplateV2, TemplateStatus } from '../types';

export type TplFormData = {
  name: string;
  divId: number;
  deptId: number;
  posId: number;
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
  const { data: divisions = [] } = useDivisions();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();

  const [form, setForm] = useState<TplFormData>(
    initial
      ? {
          name: initial.name,
          divId: initial.divId,
          deptId: initial.deptId,
          posId: initial.posId,
          summary: initial.summary,
          status: initial.status,
        }
      : {
          name: '',
          divId: 0,
          deptId: 0,
          posId: 0,
          summary: '',
          status: 'draft',
        }
  );

  const up = (p: Partial<TplFormData>) => setForm((f) => ({ ...f, ...p }));

  // Filtering logic
  const filteredDepts = useMemo(
    () => departments.filter((d) => d.divId === form.divId),
    [departments, form.divId]
  );
  const filteredPositions = useMemo(
    () => positions.filter((p) => p.deptId === form.deptId),
    [positions, form.deptId]
  );

  // Auto-fill template name from position title if empty or just changed position
  useEffect(() => {
    if (!initial && form.posId) {
      const pos = positions.find((p) => p.id === form.posId);
      if (pos && (!form.name || positions.some((p) => p.title === form.name))) {
        up({ name: pos.title });
      }
    }
  }, [form.posId, positions, initial]);

  const valid =
    form.name.trim() && form.divId > 0 && form.deptId > 0 && form.posId > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02] space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Division <span className="text-red-500">*</span>
            </label>
            <select
              value={form.divId}
              onChange={(e) =>
                up({ divId: Number(e.target.value), deptId: 0, posId: 0 })
              }
              className={inputCls}
            >
              <option value={0}>Select Division</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={form.deptId}
              disabled={!form.divId}
              onChange={(e) => up({ deptId: Number(e.target.value), posId: 0 })}
              className={inputCls}
            >
              <option value={0}>Select Department</option>
              {filteredDepts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              value={form.posId}
              disabled={!form.deptId}
              onChange={(e) => up({ posId: Number(e.target.value) })}
              className={inputCls}
            >
              <option value={0}>Select Position</option>
              {filteredPositions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
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

          <div className="col-span-2">
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => up({ name: e.target.value })}
              placeholder="e.g. Software Engineer Standard"
              className={inputCls}
            />
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
